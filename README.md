# CMS
Broadcast Order Management 
# Google Apps Script: Order Submission System

This project powers a custom Google Sheets order submission workflow, including:
- Customer lookup from an external sheet
- Adding and scheduling order lines
- Selecting creative assets (“copy”) based on the customer
- Submitting and saving the final order to a centralized database
- Copying and organizing the form in Drive

## Folder Structure

- `ui/` — User interface code for modals and menus
- `logic/` — Main functional logic grouped by feature
- `calculations/` — Aggregated calculations (e.g., total spots)
- `utils/` — General-purpose helper utilities
- `html/` — HTML forms and UI popups

## Deployment

1. Open your Google Apps Script project.
2. Create matching `.gs` and `.html` files for each section.
3. Copy code from the respective folders into each.
4. Update IDs (spreadsheet, folder) to match your system.
