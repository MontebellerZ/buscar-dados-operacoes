import Api from "./api";

async function teste() {
  const res = await Api.Login();
  console.log(res);
}

teste().catch((err) => console.error(err));
