import axios from "axios";

export async function getAllProcess(page: number, size: number) {
  return await axios.get(
    "https://6365-45-7-1-149.ngrok-free.app/api/process/findAll",
    {
      headers: {
        "ngrok-skip-browser-warning": true,
        "content-type": "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjRkY2E0YmEzLTA5ZDUtNGY0ZS1hZTBhLTc2OTc4OWUyZjJlZiIsIm5hbWUiOiJpdXJ5MiIsInByb2ZpbGUiOiJFTVBMT1lFRSIsImVtcGxveWVlIjp7ImlkIjoiZThjMzMwYzUtNWVmNS00NDIyLTg4MDgtNzVjMzVlZDNiOTVjIn0sImlhdCI6MTY5MjEyMDg5OSwiZXhwIjoxNzIzNjU2ODk5fQ.JjY86nLMLoE-vPDqFVsMenoZblyHF1QDKhVR43QSBdM",
      },
      params: {
        page,
        size,
      },
    },
  );
}
