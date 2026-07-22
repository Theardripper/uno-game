import ky from "ky";
const api = ky.create({
    hooks: {
        beforeRequest: [
            (request) => {
                console.log(request);
            }
        ]
    }
});
api.get("https://jsonplaceholder.typicode.com/todos/1").catch(() => {});
