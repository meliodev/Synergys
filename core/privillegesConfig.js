

export const privilleges = {
    "Responsable technique": {
        "tasks": { "queryFilters": [{ "operation": "array-contains", "value": "tech", "filterOrder": 1, "clause": "where", "filter": "natures" }, { "field": "createdAt", "sort": "desc", "filterOrder": 2, "clause": "orderBy" }], "canDelete": false, "canRead": true, "canCreate": true, "canUpdate": true },
        "users": { "canDelete": false, "canRead": true, "canCreate": false, "canUpdate": false },
        "requests": { "queryFilters": [{ "valueSource": "type", "operation": "==", "filterOrder": 1, "value": "", "clause": "where", "filter": "type" }, { "sort": "desc", "filterOrder": 2, "field": "createdAt", "clause": "orderBy" }], "canDelete": false, "canRead": true, "canCreate": true, "canUpdate": false },
        "orders": { "queryFilters": [{ "sort": "desc", "filterOrder": 2, "field": "createdAt", "clause": "orderBy" }, { "operation": "==", "value": false, "filterOrder": "1", "clause": "where", "filter": "deleted" }], "canDelete": true, "canRead": true, "canCreate": true, "canUpdate": true },
        "messages": { "queryFilters": [{ "valueSource": "currentUser", "filterOrder": 1, "operation": "array-contains", "clause": "where", "value": "", "filter": "subscribers" }, { "sort": "desc", "filterOrder": 2, "field": "sentAt", "clause": "orderBy" }], "canDelete": false, "canRead": true, "canCreate": true, "canUpdate": false },
        "documents": { "queryFilters": [{ "field": "createdAt", "sort": "desc", "filterOrder": 2, "clause": "orderBy" }, { "operation": "==", "value": false, "filterOrder": "1", "filter": "deleted", "clause": "where" }], "canDelete": false, "canRead": true, "canCreate": true, "canUpdate": true },
        "teams": { "canDelete": false, "canRead": true, "canCreate": false, "canUpdate": false },
        "clients": { "canDelete": true, "canRead": true, "canCreate": true, "canUpdate": true },
        "projects": { "queryFilters": [{ "field": "createdAt", "sort": "desc", "filterOrder": 2, "clause": "orderBy" }, { "operation": "==", "value": false, "filterOrder": "1", "filter": "deleted", "clause": "where" }], "canDelete": false, "canRead": true, "canCreate": true, "canUpdate": true }
    },
    "Poseur": {
        "tasks": { "queryFilters": [{ "valueSource": "currentUser", "operation": "==", "filterOrder": 1, "value": "", "clause": "where", "filter": "assignedTo.id" }, { "operation": "==", "value": false, "filterOrder": 2, "clause": "where", "filter": "deleted" }], "canDelete": false, "canRead": true, "canCreate": true, "canUpdate": true },
        "users": { "canDelete": false, "canRead": true, "canCreate": false, "canUpdate": false },
        "requests": { "queryFilters": [{ "operation": "==", "value": "ticket", "filterOrder": 1, "clause": "where", "filter": "type" }, { "field": "createdAt", "sort": "desc", "filterOrder": 2, "clause": "orderBy" }], "canDelete": false, "canRead": true, "canCreate": true, "canUpdate": false },
        "orders": { "canDelete": false, "canRead": false, "canCreate": false, "canUpdate": false },
        "messages": { "queryFilters": [{ "clause": "where", "value": "", "operation": "array-contains", "filterOrder": 1, "valueSource": "currentUser", "filter": "subscribers" }, { "field": "sentAt", "sort": "desc", "filterOrder": 2, "clause": "orderBy" }], "canDelete": false, "canRead": true, "canCreate": true, "canUpdate": false },
        "documents": { "queryFilters": [{ "clause": "where", "value": "", "operation": "==", "filterOrder": 1, "valueSource": "currentUser", "filter": "project.techContact.id" }, { "sort": "desc", "filterOrder": 2, "field": "createdAt", "clause": "orderBy" }], "canDelete": false, "canRead": false, "canCreate": false, "canUpdate": false },
        "teams": { "canDelete": false, "canRead": true, "canCreate": false, "canUpdate": false },
        "projects": { "queryFilters": [{ "valueSource": "currentUser", "filterOrder": 1, "operation": "==", "value": "", "clause": "where", "filter": "techContact.id" }, { "operation": "==", "value": false, "filterOrder": 2, "filter": "deleted", "clause": "where" }, { "sort": "desc", "filterOrder": 3, "field": "createdAt", "clause": "orderBy" }], "canDelete": false, "canRead": true, "canCreate": false, "canUpdate": true },
        "clients": { "canDelete": false, "canRead": true, "canCreate": false, "canUpdate": false }
    },
    "Directeur commercial": {
        "tasks": { "queryFilters": [{ "operation": "array-contains", "value": "com", "filterOrder": 1, "filter": "natures", "clause": "where" }, { "field": "createdAt", "sort": "desc", "filterOrder": 2, "clause": "orderBy" }], "canDelete": false, "canRead": true, "canCreate": true, "canUpdate": true },
        "users": { "canDelete": false, "canRead": true, "canCreate": false, "canUpdate": false },
        "requests": { "queryFilters": [{ "valueSource": "type", "filterOrder": 1, "operation": "==", "value": "", "clause": "where", "filter": "type" }, { "field": "createdAt", "sort": "desc", "filterOrder": 2, "clause": "orderBy" }], "canDelete": false, "canRead": true, "canCreate": true, "canUpdate": false },
        "orders": { "queryFilters": [{ "field": "createdAt", "sort": "desc", "filterOrder": 2, "clause": "orderBy" }, { "operation": "==", "value": false, "filterOrder": "1", "clause": "where", "filter": "deleted" }], "canDelete": false, "canRead": false, "canCreate": false, "canUpdate": false },
        "messages": { "queryFilters": [{ "valueSource": "currentUser", "operation": "array-contains", "filterOrder": 1, "value": "", "clause": "where", "filter": "subscribers" }, { "sort": "desc", "filterOrder": 2, "field": "sentAt", "clause": "orderBy" }], "canDelete": false, "canRead": true, "canCreate": true, "canUpdate": false },
        "documents": { "queryFilters": [{ "sort": "desc", "filterOrder": 2, "field": "createdAt", "clause": "orderBy" }, { "operation": "==", "value": false, "filterOrder": "1", "clause": "where", "filter": "deleted" }], "canDelete": false, "canRead": true, "canCreate": true, "canUpdate": true },
        "teams": { "canDelete": false, "canRead": true, "canCreate": false, "canUpdate": false },
        "projects": { "queryFilters": [{ "field": "createdAt", "sort": "desc", "filterOrder": 2, "clause": "orderBy" }, { "operation": "==", "value": false, "filterOrder": "1", "clause": "where", "filter": "deleted" }], "canDelete": false, "canRead": true, "canCreate": true, "canUpdate": true },
        "clients": { "canDelete": true, "canRead": true, "canCreate": true, "canUpdate": true }
    },
    "Commercial": {
        "tasks": { "queryFilters": [{ "clause": "where", "value": "", "operation": "==", "filterOrder": 1, "valueSource": "currentUser", "filter": "assignedTo.id" }], "canDelete": false, "canRead": true, "canCreate": true, "canUpdate": true },
        "users": { "canDelete": false, "canRead": true, "canCreate": false, "canUpdate": false },
        "requests": { "queryFilters": [{ "valueSource": "type", "filterOrder": 1, "operation": "==", "clause": "where", "value": "", "filter": "type" }, { "field": "createdAt", "sort": "desc", "filterOrder": 2, "clause": "orderBy" }], "canDelete": false, "canRead": true, "canCreate": true, "canUpdate": false },
        "orders": { "queryFilters": [{ "clause": "where", "value": "", "operation": "==", "filterOrder": 1, "valueSource": "currentUser", "filter": "project.comContact.id" }, { "operation": "==", "value": false, "filterOrder": 2, "filter": "deleted", "clause": "where" }, { "sort": "desc", "filterOrder": 3, "field": "createdAt", "clause": "orderBy" }], "canDelete": false, "canRead": true, "canCreate": true, "canUpdate": true },
        "messages": { "queryFilters": [{ "clause": "where", "value": "", "operation": "array-contains", "filterOrder": 1, "valueSource": "currentUser", "filter": "subscribers" }, { "sort": "desc", "filterOrder": 2, "field": "sentAt", "clause": "orderBy" }], "canDelete": false, "canRead": true, "canCreate": true, "canUpdate": false },
        "documents": { "queryFilters": [{ "valueSource": "currentUser", "filterOrder": 1, "operation": "==", "value": "", "clause": "where", "filter": "project.comContact.id" }, { "sort": "desc", "filterOrder": 3, "field": "createdAt", "clause": "orderBy" }, { "operation": "==", "value": false, "filterOrder": 2, "clause": "where", "filter": "deleted" }], "canDelete": false, "canRead": true, "canCreate": true, "canUpdate": true },
        "teams": { "canDelete": false, "canRead": true, "canCreate": false, "canUpdate": false },
        "projects": { "queryFilters": [{ "valueSource": "currentUser", "filterOrder": 1, "operation": "==", "clause": "where", "value": "", "filter": "comContact.id" }, { "operation": "==", "value": false, "filterOrder": 2, "clause": "where", "filter": "deleted" }, { "field": "createdAt", "sort": "desc", "filterOrder": 3, "clause": "orderBy" }], "canDelete": false, "canRead": true, "canCreate": true, "canUpdate": true },
        "clients": { "canDelete": false, "canRead": true, "canCreate": true, "canUpdate": false }
    },
    "Client": {
        "tasks": { "canDelete": false, "canRead": false, "canCreate": false, "canUpdate": false },
        "users": { "canDelete": false, "canRead": true, "canCreate": false, "canUpdate": false },
        "requests": { "queryFilters": [{ "operation": "==", "filterOrder": 1, "valueSource": "currentUser", "filter": "client.id", "value": "", "clause": "where" }, { "valueSource": "type", "operation": "==", "filterOrder": 2, "value": "", "clause": "where", "filter": "type" }, { "field": "createdAt", "sort": "desc", "filterOrder": 3, "clause": "orderBy" }], "canDelete": false, "canRead": true, "canCreate": true, "canUpdate": false },
        "orders": { "canDelete": false, "canRead": false, "canCreate": false, "canUpdate": false },
        "messages": { "queryFilters": [{ "clause": "where", "value": "", "operation": "array-contains", "filterOrder": 1, "valueSource": "currentUser", "filter": "subscribers" }, { "field": "sentAt", "sort": "desc", "filterOrder": 2, "clause": "orderBy" }], "canDelete": false, "canRead": true, "canCreate": true, "canUpdate": false },
        "documents": { "queryFilters": [{ "clause": "where", "value": "", "operation": "==", "filterOrder": 1, "valueSource": "currentUser", "filter": "project.client.id" }, { "sort": "desc", "filterOrder": 2, "field": "createdAt", "clause": "orderBy" }], "canDelete": false, "canRead": true, "canCreate": true, "canUpdate": false },
        "teams": { "canDelete": false, "canRead": false, "canCreate": false, "canUpdate": false },
        "projects": { "queryFilters": [{ "valueSource": "currentUser", "operation": "==", "filterOrder": 1, "value": "", "clause": "where", "filter": "client.id" }, { "field": "createdAt", "sort": "desc", "filterOrder": 2, "clause": "orderBy" }], "canDelete": false, "canRead": true, "canCreate": false, "canUpdate": true },
        "clients": { "canDelete": false, "canRead": false, "canCreate": false, "canUpdate": false }
    },
    "Back office": {
        "tasks": { "canDelete": true, "canRead": true, "canCreate": true, "canUpdate": true },
        "users": { "canDelete": true, "canRead": true, "canCreate": true, "canUpdate": true },
        "requests": { "queryFilters": [{ "operation": "==", "filterOrder": 1, "valueSource": "type", "filter": "type", "value": "", "clause": "where" }, { "sort": "desc", "filterOrder": 2, "field": "createdAt", "clause": "orderBy" }], "canDelete": true, "canRead": true, "canCreate": true, "canUpdate": true },
        "orders": { "queryFilters": [{ "sort": "desc", "filterOrder": 2, "field": "createdAt", "clause": "orderBy" }, { "operation": "==", "value": false, "filterOrder": "1", "filter": "deleted", "clause": "where" }], "canDelete": true, "canRead": true, "canCreate": true, "canUpdate": true },
        "messages": { "queryFilters": [{ "sort": "desc", "filterOrder": 2, "field": "sentAt", "clause": "orderBy" }, { "valueSource": "currentUser", "filterOrder": "1", "operation": "array-contains", "clause": "where", "value": "", "filter": "subscribers" }], "canDelete": true, "canRead": true, "canCreate": true, "canUpdate": true },
        "documents": { "queryFilters": [{ "field": "createdAt", "sort": "desc", "filterOrder": 2, "clause": "orderBy" }, { "operation": "==", "value": false, "filterOrder": "1", "clause": "where", "filter": "deleted" }], "canDelete": true, "canRead": true, "canCreate": true, "canUpdate": true },
        "teams": { "canDelete": true, "canRead": true, "canCreate": true, "canUpdate": true },
        "clients": { "canDelete": true, "canRead": true, "canCreate": true, "canUpdate": true },
        "projects": { "queryFilters": [{ "sort": "desc", "filterOrder": 2, "field": "createdAt", "clause": "orderBy" }, { "operation": "==", "value": false, "filterOrder": "1", "clause": "where", "filter": "deleted" }], "canDelete": true, "canRead": true, "canCreate": true, "canUpdate": true }
    },
    "Admin": {
        "tasks": { "canDelete": true, "canRead": true, "canCreate": true, "canUpdate": true },
        "users": { "canDelete": true, "canRead": true, "canCreate": true, "canUpdate": true },
        "requests": { "queryFilters": [{ "clause": "where", "value": "", "operation": "==", "filterOrder": 1, "valueSource": "type", "filter": "type" }, { "sort": "desc", "filterOrder": 2, "field": "createdAt", "clause": "orderBy" }], "canDelete": true, "canRead": true, "canCreate": true, "canUpdate": true },
        "orders": { "queryFilters": [{ "field": "createdAt", "sort": "desc", "filterOrder": 2, "clause": "orderBy" }, { "operation": "==", "value": false, "filterOrder": "1", "filter": "deleted", "clause": "where" }], "canDelete": true, "canRead": true, "canCreate": true, "canUpdate": true },
        "messages": { "queryFilters": [{ "field": "sentAt", "sort": "desc", "filterOrder": 2, "clause": "orderBy" }, { "valueSource": "currentUser", "operation": "array-contains", "filterOrder": "1", "value": "", "clause": "where", "filter": "subscribers" }], "canDelete": true, "canRead": true, "canCreate": true, "canUpdate": true },
        "documents": { "queryFilters": [{ "sort": "desc", "filterOrder": 2, "field": "createdAt", "clause": "orderBy" }, { "operation": "==", "value": false, "filterOrder": "1", "clause": "where", "filter": "deleted" }], "canDelete": true, "canRead": true, "canCreate": true, "canUpdate": true },
        "teams": { "canDelete": true, "canRead": true, "canCreate": true, "canUpdate": true },
        "projects": { "queryFilters": [{ "sort": "desc", "filterOrder": 2, "field": "createdAt", "clause": "orderBy" }, { "operation": "==", "value": false, "filterOrder": "1", "clause": "where", "filter": "deleted" }], "canDelete": true, "canRead": true, "canCreate": true, "canUpdate": true },
        "clients": { "canDelete": true, "canRead": true, "canCreate": true, "canUpdate": true }
    }
}