#!/usr/bin/env bash
# PreToolUse hook for the review-agent subagent: lets only read-only Bash commands through.
# Exit 2 blocks the command and sends stderr back to the agent.
# ponytail: allowlists the start of each command segment, it is not a shell parser. Quoted
# separators split too, which only blocks more. Swap for a real parser if it blocks valid reads.
set -euo pipefail

cmd=$(jq -r '.tool_input.command // ""')

block() {
  echo "Blocked by read-only-bash.sh: $1. review-agent may only run read-only commands." >&2
  exit 2
}

case "$cmd" in
  *'>'* | *'$('* | *'`'*) block "redirection or command substitution" ;;
  *--output*) block "--output writes a file" ;;
  *--upload-pack*) block "--upload-pack runs a command" ;;
esac

# No sort, uniq, or yq: `sort -o`, `uniq IN OUT`, and `yq -i` write files.
allowed='^(cd|cat|head|tail|grep|wc|jq|diff|ls)( |$)'
allowed+='|^git (show|log|diff|fetch|ls-files|ls-tree|blame|rev-parse|merge-base|status|branch --show-current|submodule status)( |$)'
allowed+='|^gh (pr (view|diff|checks|list)|issue (view|list)|repo view)( |$)'

nl=$'\n'
segments=${cmd//&&/$nl}
segments=${segments//||/$nl}
segments=${segments//;/$nl}
segments=${segments//|/$nl}
segments=${segments//&/$nl}

while read -r segment; do
  [ -z "$segment" ] && continue
  [[ "$segment" =~ $allowed ]] || block "'$segment' is not on the allowlist"
done <<< "$segments"

exit 0
