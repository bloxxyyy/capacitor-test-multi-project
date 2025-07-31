from fastapi.testclient import TestClient
from src.main import app

client = TestClient(app)


def test_post_and_get_example():
    response_post = client.post("/example", json={"name": "Alice", "age": 25})
    assert response_post.status_code == 200
    assert response_post.json() == {"message": "Object stored successfully"}

    response_get = client.get("/example")
    assert response_get.status_code == 200
    assert response_get.json() == {"name": "Alice", "age": 25}
