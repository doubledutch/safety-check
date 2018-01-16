# Safety-Check

This project provides a safety check-in functionality for event organizers to inform their attendees and have them check in as safe or out of area. Within the project we are using 2 JSON Objects, to begin/end the safety check and track the attendee check-in.

* We can create the safety check via:
  fbc.database.public.adminRef('checks').push(true)
  
  * It would be stored under public/admin/checks as:
            {"checks":
                {"-L3-s4zouD4vk-Ryzgky":true}
            }
    
    By using public/admin we are allowing the user to read the object but only admins can write/create them. The object contains a key and boolean.

* For the attendee check-in we use private/adminable/users as only the specific user and admin should have access to viewing/updating this data point. Since this is the only data point being tracked for this app we can create it via:
        fbc.database.private.adminableUserRef("status").set("safe")

  * In our database it would be stored as:
    {"24601":
        {"status":"OOA"}
    }

This method is possible because by using firebase listener: fbc.database.private.adminableUsersRef() we will pull the data for each user.








