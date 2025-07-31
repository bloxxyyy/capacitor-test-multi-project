from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()


class ExampleObject(BaseModel):
    name: str
    age: int


stored_example: ExampleObject | None = None


@app.post("/example")
async def post_example(obj: ExampleObject):
    global stored_example
    stored_example = obj
    return {"message": "Object stored successfully"}


@app.get("/example", response_model=ExampleObject | None)
async def get_example():
    return stored_example
