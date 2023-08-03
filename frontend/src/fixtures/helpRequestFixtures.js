const helpRequestsFixtures = {
    oneRequest: {
        "id": 1,
        "requesterEmail" : "elfouly@ucsb.edu",
        "teamId" : "team02",
        "tableOrBreakoutRoom" : "2",
        "requestTime": "2022-01-02T12:00:00",
        "explanation" : "googlelogin",
        "solved" : "false"
    },
    threeRequests: [
        {
            "id": 1,
            "requesterEmail" : "one@ucsb.edu",
            "teamId" : "team01",
            "tableOrBreakoutRoom" : "1",
            "requestTime": "2020-01-02T12:00:00",
            "explanation" : "frontend",
            "solved" : "true"
        },
        {
            "id": 2,
            "requesterEmail" : "other@ucsb.edu",
            "teamId" : "team02",
            "tableOrBreakoutRoom" : "2",
            "requestTime": "2021-01-02T12:00:00",
            "explanation" : "posgres",
            "solved" : "false"
        },
        {
            "id": 3,
            "requesterEmail" : "another@ucsb.edu",
            "teamId" : "team03",
            "tableOrBreakoutRoom" : "3",
            "requestTime": "2023-01-02T12:00:00",
            "explanation" : "good",
            "solved" : "true"
        }
    ]
};


export { helpRequestsFixtures };