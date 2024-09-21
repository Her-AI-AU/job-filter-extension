let APPKEY = "";
const yearOE = 3;
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
          'You are a helpful job hunting assistant. You read job description and look for the reqirment of the job. You should return a json data. The return data should be {prRequest: bool, keyTechStack:[], yearOfExperience: num}. Every keys in return data should be quoted by `"`. Remove ```json``` in return data. If years of experience is a range, it should return minimum value. prRequest should return if any request of permanent resident / citizen / minimum Negative Vetting or higher clearance exist in job description. Do not wrap in keyTechStack.',
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
  const positions = document.querySelectorAll("article");

  await fetchToken();

  positions.forEach(async (position) => {
    const title = position.querySelector("h3 > div > a");
    const data = await catchPage(title.href);
    const response = await requestGPT(APPKEY, data.jobDescription);

    if (response.prRequest)
      position.setAttribute("style", "border: 2px solid #eb5e37 !important;");
    if (response.yearOfExperience <= yearOE)
      position.setAttribute("style", "border: 2px solid #40eb84 !important;");
    else if (response.yearOfExperience > yearOE)
      position.setAttribute("style", "border: 2px solid #ae54ef !important;");    

    // add a tech stack tag-list
    const tags = response.keyTechStack;
    const tagList = document.createElement("div");
    tagList.className = "tag-list";

    tags.forEach((tag) => {
      // create tag elements
      const tagBorderElement = document.createElement("div");
      tagBorderElement.className = "tag-border";

      const tagInnerElement = document.createElement("div");
      tagInnerElement.className = "tag-inner";

      const contextElement = document.createElement("span");
      contextElement.className = "tag-text";
      contextElement.textContent = tag;

      tagInnerElement.appendChild(contextElement);
      tagBorderElement.appendChild(tagInnerElement);
      tagList.appendChild(tagBorderElement);
    });

    title.parentNode.appendChild(tagList);
  });
}

// start
main();
