import requestLambda from "./requestLambda";

describe("requestLambda", () => {
  const jdWithoutPr =
    "Are you a junior to mid level Java developer?  We're looking for someone with 1 to 3 years experience.Here's your chance to hone your skills and develop further working on interesting software, mentored by some of Melbourne's smartest Java developers. It's an opportunity to learn ReactJS too!The right person for this job:has somewhere in the range of 1 to 3 years Java development experiencehas Java programming experiencloves development and wants to learn moreJavaScript / React / Amazon / Docker / Kubernetes experience would be a bonus but is not a requirement - you can learn all that on the job.has great communication skillscan work independently and get things doneIn this role:You'll be working with a team of Melbourne's best Java developersYou'll be working on sophisticated back end systemsAbout 20% of your time will be working on React based front end systemsYou'll be working to make the companies product more cloud native so you will be learning about Amazon Web Services.";
  const jdWithPr =
    "The OpportunityOne of our Federal Government clients are presenting an opportunity for .NET Developers to join their team in Canberra. They are offering multiple vacancies, with hybrid working arrangements that include both onsite attendance at the office and the flexibility of remote work. This role is part of the Departments ongoing efforts to enhance their technological infrastructure and systems, likely supporting critical functions related to highly complexed and high-volume processes. The position offers a chance to contribute to important national projects while enjoying a balanced work environment.Candidates MUST be Australian Citizens, with a minimum Negative Vetting (NV1) or higher clearance.Key responsibilities (but not limited to):Development and Maintenance: Participate in the design, development, and maintenance of software applications to support the Department's operations.Code Quality: Ensure the quality of the codebase by following best practices, including code reviews and adherence to coding standards.Collaboration: Work closely with other team members, including business analysts and testers, to deliver high-quality software solutions.Troubleshooting: Identify and resolve technical issues and defects in software applications.Continuous Improvement: Contribute to the continuous improvement of development processes and tools.If you’re interested in the opportunity, feel free to contact our Relationship Director, Sit Mailei via email at Sit@canberraconsulting.com.au to discuss further.";
  const mockResponseWithoutPr = {
    prRequest: false,
    keyTechStack: [
      "Java",
      "JavaScript",
      "React",
      "ReactJS",
      "Amazon Web Services",
      "Docker",
      "Kubernetes",
    ],
    yearOfExperience: 1,
  };
  const mockResponseWithPr = {
    keyTechStack: [".NET"],
    prRequest: true,
    yearOfExperience: 0,
  };
  it("request jd without pr request", async () => {
    const response = await requestLambda(jdWithoutPr);
    response.keyTechStack.forEach((element) => {
      expect(mockResponseWithoutPr.keyTechStack).toContain(element);
    });
    expect(mockResponseWithoutPr.prRequest).toBe(response.prRequest);
    expect(mockResponseWithoutPr.yearOfExperience).toBe(
      response.yearOfExperience
    );
  });

  it("request jd with pr request", async () => {
    const response = await requestLambda(jdWithPr);
    expect(mockResponseWithPr).toEqual(response);
  });
});
