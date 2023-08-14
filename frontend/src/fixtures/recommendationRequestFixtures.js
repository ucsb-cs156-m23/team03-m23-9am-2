const recommendationRequestFixtures = {
    oneRecommendationRequest:
    [
      {
       "id": 1,
        "requesterEmail": "1a@ucsb.edu",
        "professorEmail": "1b@ucsb.edu" ,
        "explanation": "1",
        "dateRequested": "2022-09-28T00:00:00",
        "dateNeeded": "2022-09-28T00:00:00" , 
        "done": "1"
             
      }
    ],

    threeRecommendationRequests:
    [
        {
            "id": 2,
            "requesterEmail": "2a@ucsb.edu",
            "professorEmail": "2b@ucsb.edu" ,
            "explanation": "2",
            "dateRequested": "2022-09-28T00:00:00",
            "dateNeeded": "2022-09-28T00:00:00" , 
            "done": "0"
        },

        {
            "id": 3,
            "requesterEmail": "3a@ucsb.edu",
            "professorEmail": "3b@ucsb.edu" ,
            "explanation": "3",
            "dateRequested": "2022-09-28T00:00:00",
            "dateNeeded": "2022-09-28T00:00:00" , 
            "done": "1"
        },

        {
            "id": 4,
            "requesterEmail": "4a@ucsb.edu",
            "professorEmail": "4b@ucsb.edu" ,
            "explanation": "4",
            "dateRequested": "2022-09-28T00:00:00",
            "dateNeeded": "2022-09-28T00:00:00" , 
            "done": "0"
        },
        
    ]
};

export { recommendationRequestFixtures };