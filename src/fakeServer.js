function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function randomDelay() {
  return 1000 + Math.floor(Math.random() * 1000);
}

function shouldFail() {
  return Math.random() < 0.2;
}

export async function createTask(task) {
  await sleep(randomDelay());
  if (shouldFail()) throw new Error("Create failed");
  return task;
}

export async function updateTask() {
  await sleep(randomDelay());
  if (shouldFail()) throw new Error("Update failed");
}

export async function deleteTask() {
  await sleep(randomDelay());
  if (shouldFail()) throw new Error("Delete failed");
}
