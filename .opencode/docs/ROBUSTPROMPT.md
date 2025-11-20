You are building the following application. If any detail is missing, choose sensible defaults and proceed, then document what you assumed.
[Replace the bracketed content below. If a section does not apply, delete it.]

## Goal
- Primary objective: [clear, outcome-focused goal in one sentence]
- Success criteria: [3 to 6 measurable checks the app must pass on day one]
- Non-goals: [things explicitly out of scope]

## Audience
- Users: [roles or job titles, for example “intake submitters”, “approvers”, “operations analysts”]
- Skill level: [novice, intermediate, expert]
- Usage pattern: [daily, weekly, ad-hoc, mobile in field, call-center desktop, etc.]

## App Identity
- App name: [e.g., “Equipment Checkout”]
- Data classification: [internal, confidential, restricted]
- Themeing: [Default or pick a mood/vibe that you are going for]

## What the App Must Do
- Core capabilities (list 5 to 10 plain language statements):
  1. [e.g., “Allow staff to request equipment with desired pickup date.”]
  2. [...]
- SLAs or service targets: [e.g., “approval within 2 business days”, “fulfillment within 5 business days”]
- Reporting needs: [e.g., aging by state, throughput by month, backlog by assignee]

## Data Model (Tables, fields, relationships)
[This is optional, you can also let Build Agent guess entirely!]
Create the following tables. Include dictionary attributes, reference integrity, choice lists, indexes, and demo data. 
Unless otherwise stated, add standard fields (Number, State, Assigned to, Short description, Description, Opened by, Opened, Updated, Active).

[TABLE 1]
- Table label and name: [Label], [x_[company]_[table]]
- Extends: [task or none]
- Ownership: [who creates and updates records]
- Fields:
  - [field_name] (type: [string|integer|reference to [table]|choice|date|datetime|boolean|currency|URL|email|attachment], required: [yes/no], max length: [n], default: [value], notes: [validation or regex])
  - [repeat per field]
- Choices (if any): 
  - [field_name]: [value=Label, value=Label, ...]
- Business rules on this table:
  - [rule name]: [when to run, what it enforces]
- Indexes and uniqueness:
  - [field or composite], unique: [yes/no]

[TABLE 2]
- Table label and name: [...]
- Extends: [...]
- Fields: [...]
- Relationships:
  - One-to-many or many-to-many with [table], store in [m2m table if needed], cascade delete: [yes/no]
- Sample records: [...]
[Repeat for each table]

## Automation (What scripts/business rules Build Agent should make for you)
[Describe what should happen with records when submitted]

## User Experience
[Describe how the user should interact with your app]

## Security and Roles
- Roles: 
- ACLs:

## Output Required From You (the build agent)
Provide at the end:
1) A build log of everything created (names and paths) 
2) A quick start checklist (how each role uses the app) 
3) Any assumptions you made 

## Constraints and Defaults
- [Things like, I prefer that you do X over Y when possible]
- If a choice must be made and nothing is specified, choose the simplest workable option and document it