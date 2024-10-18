const POLL_SECONDS = 60;

const poll = async () => {
  const proc = Bun.spawn(["bun", "run", "index.ts"], { stdout: "inherit" });
  await proc.exited;

  setTimeout(poll, POLL_SECONDS * 1000);
};

poll();
