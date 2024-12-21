const schema = {
    "users": [
      {
        "_id": "string", // Unique user identifier
        "name": "string", // Full name of the user
        "email": "string", // Email address
        "role": "string", // Role (e.g., Employee, Manager, Admin)
        "projects": ["string"] // List of project IDs the user is associated with
      }
    ],
    "projects": [
      {
        "_id": "string", // Unique project identifier
        "name": "string", // Project name
        "description": "string", // Description of the project
        "manager_id": "string", // User ID of the manager
        "team_members": ["string"], // List of user IDs in the project team
        "status": "string" // Status of the project (e.g., Active, Completed, On Hold)
      }
    ],
    "daily_logs": [
      {
        "_id": "string", // Unique log identifier
        "user_id": "string", // User ID of the person logging hours
        "project_id": "string", // Project ID the log is associated with
        "date": "string", // Date of the log (YYYY-MM-DD)
        "hours_logged": "number", // Total hours logged
        "tasks": [
          {
            "task_name": "string", // Name of the task
            "description": "string", // Description of the task
            "hours_spent": "number" // Hours spent on the task
          }
        ],
        "status": "string" // Status of the log (e.g., Submitted, Reviewed)
      }
    ]
  }
  