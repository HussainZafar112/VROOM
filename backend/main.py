from fastapi import FastAPI

from routes import auth, vehicles, scans

app = FastAPI(title="VROOM Backend API")


@app.get("/")
def root():
    return 10


app.include_router(auth.router)
app.include_router(vehicles.router)
app.include_router(scans.router)
