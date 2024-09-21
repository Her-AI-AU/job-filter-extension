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

const APPKEY="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";
const jdWithPr ="The OpportunityOne of our Federal Government clients are presenting an opportunity for .NET Developers to join their team in Canberra. They are offering multiple vacancies, with hybrid working arrangements that include both onsite attendance at the office and the flexibility of remote work. This role is part of the Departments ongoing efforts to enhance their technological infrastructure and systems, likely supporting critical functions related to highly complexed and high-volume processes. The position offers a chance to contribute to important national projects while enjoying a balanced work environment.Candidates MUST be Australian Citizens, with a minimum Negative Vetting (NV1) or higher clearance.Key responsibilities (but not limited to):Development and Maintenance: Participate in the design, development, and maintenance of software applications to support the Department's operations.Code Quality: Ensure the quality of the codebase by following best practices, including code reviews and adherence to coding standards.Collaboration: Work closely with other team members, including business analysts and testers, to deliver high-quality software solutions.Troubleshooting: Identify and resolve technical issues and defects in software applications.Continuous Improvement: Contribute to the continuous improvement of development processes and tools.If you’re interested in the opportunity, feel free to contact our Relationship Director, Sit Mailei via email at Sit@canberraconsulting.com.au to discuss further.";
console.log(await requestGPT());

export default requestGPT;
