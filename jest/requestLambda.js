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

const jd = "The OpportunityOne of our Federal Government clients are presenting an opportunity for .NET Developers to join their team in Canberra. They are offering multiple vacancies, with hybrid working arrangements that include both onsite attendance at the office and the flexibility of remote work. This role is part of the Departments ongoing efforts to enhance their technological infrastructure and systems, likely supporting critical functions related to highly complexed and high-volume processes. The position offers a chance to contribute to important national projects while enjoying a balanced work environment.Candidates MUST be Australian Citizens, with a minimum Negative Vetting (NV1) or higher clearance.Key responsibilities (but not limited to):Development and Maintenance: Participate in the design, development, and maintenance of software applications to support the Department's operations.Code Quality: Ensure the quality of the codebase by following best practices, including code reviews and adherence to coding standards.Collaboration: Work closely with other team members, including business analysts and testers, to deliver high-quality software solutions.Troubleshooting: Identify and resolve technical issues and defects in software applications.Continuous Improvement: Contribute to the continuous improvement of development processes and tools.If you’re interested in the opportunity, feel free to contact our Relationship Director, Sit Mailei via email at Sit@canberraconsulting.com.au to discuss further.";
console.log(await requestLambda(jd));


export default requestLambda;
