const helpRequestFixtures = {
    oneRequest: 
    [
        {
        "id": 1,
        "requesterEmail" : "elfouly@ucsb.edu",
        "teamId" : "team02",
        "tableOrBreakoutRoom" : "2",
        "requestTime": "2022-01-02T12:00:00",
        "explanation" : "googlelogin",
        "solved" : "False"
    }
    ],
    threeRequests: 
    [
        {
            "id": 2,
            "requesterEmail" : "one@ucsb.edu",
            "teamId" : "team01",
            "tableOrBreakoutRoom" : "1",
            "requestTime": "2020-01-02T12:00:00",
            "explanation" : "frontend",
            "solved" : "True"
        },
        {
            "id": 3,
            "requesterEmail" : "other@ucsb.edu",
            "teamId" : "team02",
            "tableOrBreakoutRoom" : "2",
            "requestTime": "2021-01-02T12:00:00",
            "explanation" : "posgres",
            "solved" : "False"
        },
        {
            "id": 4,
            "requesterEmail" : "another@ucsb.edu",
            "teamId" : "team03",
            "tableOrBreakoutRoom" : "3",
            "requestTime": "2023-01-02T12:00:00",
            "explanation" : "good",
            "solved" : "True"
        }
    ]
};


export { helpRequestFixtures };