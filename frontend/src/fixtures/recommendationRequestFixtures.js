const recommendationRequestFixtures = {
    oneRecommendationRequest:
    [
      {
       "id": 1,
        "requesterEmail": "1a@ucsb.edu",
        "professorEmail": "1b@ucsb.edu" ,
        "explanation": "explanation1",
        "dateRequested": "2021-09-28T10:00:00",
        "dateNeeded": "2021-09-28T20:00:00" , 
        "done": "true"
             
      }
    ],

    threeRecommendationRequests:
    [
        {
            "id": 2,
            "requesterEmail": "2a@ucsb.edu",
            "professorEmail": "2b@ucsb.edu" ,
            "explanation": "explanation2",
            "dateRequested": "2022-09-28T10:00:00",
            "dateNeeded": "2022-09-28T20:00:00" , 
            "done": "false"
        },

        {
            "id": 3,
            "requesterEmail": "3a@ucsb.edu",
            "professorEmail": "3b@ucsb.edu" ,
            "explanation": "explanation3",
            "dateRequested": "2023-09-28T10:00:00",
            "dateNeeded": "2023-09-28T20:00:00" , 
            "done": "true"
        },

        {
            "id": 4,
            "requesterEmail": "4a@ucsb.edu",
            "professorEmail": "4b@ucsb.edu" ,
            "explanation": "explanation4",
            "dateRequested": "2024-09-28T10:00:00",
            "dateNeeded": "2024-09-28T20:00:00" , 
            "done": "false"
        },
        
    ]
};

export { recommendationRequestFixtures };