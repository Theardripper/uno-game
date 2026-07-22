import { api } from "./client";

export async function getHealth() {
    return api
        .get("health")
        .json();
}
