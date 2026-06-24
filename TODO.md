# TODO — Production Engineering Gaps

## Phase 1: Enhance Existing RAG Repo (covers Gaps 1, 2, 4)

- [ ] **HIGH** Add Terraform IaC (VPC + ECS + RDS + S3 + IAM)
- [ ] **HIGH** Add retry + exponential backoff + provider failover (Groq → Anthropic → OpenAI)
- [ ] MEDIUM Write `docs/infrastructure.md` explaining cloud architecture decisions
- [ ] MEDIUM Add Redis + Celery async task queue for high-concurrency
- [ ] MEDIUM Add semantic caching with TTL-based invalidation
- [ ] MEDIUM Add Locust load-test script + screenshot results in README
- [ ] LOW Add `.env.example` so anyone can clone and run
- [ ] LOW Add GitHub CI/CD workflow (like RAG repo's eval.yml)
- [ ] LOW Fix `main.py` import path to be robust without PYTHONPATH hack

## Phase 2: Fix Bugs in ProjectSmith Repo

- [ ] **HIGH** Add retry + fallback to LLM calls (same as Phase 1)
- [ ] MEDIUM Fix `pre-deploy.py` — runs tests twice (line 25 & 26 both call pytest)
- [ ] MEDIUM Fix `pre-deploy.py` — uses PowerShell `$env:` syntax, not cross-platform
- [ ] MEDIUM Add `.env.example` file
- [ ] MEDIUM Add GitHub CI/CD workflow
- [ ] LOW Fix `main.py` import path (depends on fragile PYTHONPATH)

## Phase 3: Clean Up CNN From Scratch Repo

- [ ] MEDIUM Move test code out of `CNN.py` (runs on import — basic Python mistake)
- [ ] MEDIUM Add type hints and docstrings
- [ ] LOW Add training metrics tracking instead of just printing

## Phase 4: Open-Source Signal (covers Gap 5)

- [x] MEDIUM Submit 1-2 PRs to open-source AI repos (LangChain, LlamaIndex, etc.)

## Phase 5: Portfolio Updates

- [ ] MEDIUM Add Terraform, AWS, Redis, Celery to skill tags
- [ ] MEDIUM Update About section to mention infrastructure, production hardening, async systems
- [ ] LOW Write blog post: "Production RAG: What Happens When 1,000 Users Hit Your API"
- [ ] LOW Update all READMEs to highlight scaling, security, and infra decisions
