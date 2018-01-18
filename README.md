# Safety-Check

This project provides a safety check-in functionality for event organizers to inform their attendees and have them check in as safe or out of area. Within the project we are using 2 JSON Objects, to begin/end the safety check and track the attendee check-in.

* To ensure always ensure a default of off we need to create a safety check object to activate via:
  ```fbc.database.public.adminRef('checks').push(true)```
  
  * * It would be stored under public/admin/ as:
           ``` { "checks":
                {"-L3-s4zouD4vk-Ryzgky":true} }```
    
* * By using ```public/admin``` we are creating objects that can only be edited by an admin and read by the user. This object simply contains a key and boolean since there will only be one check at any given time (it is deleted to turn off).

* For the attendee check-ins we use ```private/adminable/users``` as only the specific user and admin should have access to viewing/updating this data point. As this is the only data point for each user we can use adminableUserRef and it will be created via:
        ```fbc.database.private.adminableUserRef("status").set("safe")```

  * * In our database it would be stored as:
    ```{"24601":
        {"status":"OOA"}
    }```

* * By using using firebase listener: ```fbc.database.private.adminableUsersRef()``` it is possible to pull this data for each user.








