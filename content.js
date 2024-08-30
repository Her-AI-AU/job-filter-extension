// send request to omni
// return
// prRequest: bool
// keyTechStack: array
// yearOfExperience: num
const requestGPT = async (APPKEY, jobDescription) => {
  const url = "https://api.openai.com/v1/chat/completions";

  const data = {
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are a helpful job hunting assistant. You read job description and look for the reqirment of the job. You should return a json data. The return data should be {prRequest: bool, keyTechStack:[], yearOfExperience: num}. Remove ```json``` in return data. If years of experience is a range, it should return minimum value. prRequest should return if any request of permanent resident / citizen / minimum Negative Vetting or higher clearance exist in job description.",
      },
      {
        role: "user",
        content: jobDescription,
      },
    ],
  };

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${APPKEY}`,
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const responseData = await response.json();
    const parsedResponse = JSON.parse(responseData.choices[0].message.content);

    return parsedResponse;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};

const catchPage = async (url) => {
  try {
    const response = await fetch(url);
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const jobTitle = doc.querySelector("h1").textContent;
    const jobDescription = doc.querySelector(
      '[data-automation="jobAdDetails"]'
    ).textContent;
    return { jobTitle, jobDescription };
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};

const fetchToken = async () => {
  const url =
    "https://xzvzcrj4yh.execute-api.ap-southeast-1.amazonaws.com/get-token-api";
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    APPKEY = data.token;
  } catch (error) {
    console.error("Error:", error);
  }
};

async function main() {
  let APPKEY = "";
  const positions = document.querySelectorAll("article");

  await fetchToken();

  positions.forEach(async (position) => {
    const title = position.querySelector("h3 > div > a");
    const data = await catchPage(title.href);
    const response = await requestGPT(APPKEY, data.jobDescription);

    if (response.yearOfExperience < 3)
      position.style.backgroundColor = "lightgreen";
    else if (response.yearOfExperience > 4)
      position.style.backgroundColor = "orange";

    if (response.prRequest) position.style.backgroundColor = "red";
    else {
      const tags = response.keyTechStack;

      tags.forEach((tag) => {
        const tagElement = document.createElement("div");
        tagElement.textContent = tag;
        tagElement.className = "tag";

        // Apply styles
        tagElement.style.backgroundColor = "#007bff";
        tagElement.style.color = "#ffffff";
        tagElement.style.padding = "8px 16px";
        tagElement.style.borderRadius = "12px";
        tagElement.style.display = "inline-block";
        tagElement.style.margin = "5px";
        tagElement.style.border = "1px solid rgba(255, 255, 255, 0.1)";
        tagElement.style.fontSize = "14px";
        tagElement.style.cursor = "pointer";
        tagElement.style.transition = "all 0.3s ease";

        title.parentNode.appendChild(tagElement);
      });
    }
  });
}

// start
main();
