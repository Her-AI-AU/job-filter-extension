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

export default requestGPT;
