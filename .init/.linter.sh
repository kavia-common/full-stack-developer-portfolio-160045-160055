#!/bin/bash
cd /home/kavia/workspace/code-generation/full-stack-developer-portfolio-160045-160055/portfolio_backend
npm run lint
LINT_EXIT_CODE=$?
if [ $LINT_EXIT_CODE -ne 0 ]; then
  exit 1
fi

