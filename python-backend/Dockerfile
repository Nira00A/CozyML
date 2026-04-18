FROM python:3.12-slim

# 1. Install uv inside the container
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

# 2. Prevent Python from buffering logs (so you see errors immediately)
ENV PYTHONUNBUFFERED=1

WORKDIR /code

# 3. Copy ONLY the dependency files first (the "Layer Cake" trick)
# This way, Docker doesn't re-install packages every time you change your code
COPY pyproject.toml uv.lock ./
# OR if you are using requirements.txt: 
# COPY requirements.txt ./

# 4. Install dependencies using uv
RUN uv sync --frozen

# 5. Now copy your app code
COPY ./app ./app

EXPOSE 8000

# 6. Run the app (Fixed the host IP and used uv run)
CMD ["uv", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]