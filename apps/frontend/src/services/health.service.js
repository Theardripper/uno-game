import { api } from "@/api/client";

export async function getHealth() {
    return api
        .get("health")
        .json();
}
