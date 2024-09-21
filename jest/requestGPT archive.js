// send request to omni
// return
// pr request: bool
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
    console.log(response);
    

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

const requestAnthropic = async (APPKEY, jobDescription) => {
  const url = "https://api.anthropic.com/v1/messages";

  const data = {
    model: "claude-3-haiku-20240307",
    max_tokens: 1024,
    system:
      'You are a helpful job hunting assistant. You read job description and look for the requirement of the job. The return data should be {"prRequest": bool, "keyTechStack":[], "yearOfExperience": num}. Do not wrap. If years of experience is a range, return minimum value. prRequest return if any request of permanent resident / citizen / minimum Negative Vetting or higher clearance exist in job description. Do not wrap in keyTechStack.',
    messages: [
      {
        role: "user",
        content: jobDescription,
      },
    ],
  };

  const headers = {
    "Content-Type": "application/json",
    "x-api-key": APPKEY,
    "anthropic-version": "2023-06-01",
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
    const parsedResponse = JSON.parse(responseData.content[0].text);

    return parsedResponse;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};

export default requestGPT;
