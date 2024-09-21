const yearOE = 3;
/* 
Send request to Lambda api
Return data:
{
  prRequest: bool
  keyTechStack: array
  yearOfExperience: num
}
*/
const requestLambda = async (jobDescription) => {
  const url =
    "https://4dvwxfk9sf.execute-api.ap-southeast-1.amazonaws.com/default/summarise-jd";

  const data = {
    jobDescription: jobDescription,
  };

  const headers = {
    "Content-Type": "application/json",
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

    return responseData;
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

async function main() {
  const positions = document.querySelectorAll("article");

  positions.forEach(async (position) => {
    const title = position.querySelector("h3 > div > a");
    const data = await catchPage(title.href);
    const response = await requestLambda(data.jobDescription);

    if (response.prRequest)
      position.setAttribute("style", "border: 2px solid #eb5e37 !important;");
    else if (response.yearOfExperience <= yearOE)
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
