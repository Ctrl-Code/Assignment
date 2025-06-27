export const Endpoints: Record<string, string> = {

    // public
    getPublicPageServices: '/get-public-page-services',
    getPublicPageIncidents: '/get-public-page-incidents',
    getPublicPageIncidentUpdates: '/get-public-page-incident-updates',

    login: '/login', // login or signup
    setOrg: '/set-org',
    getUserDetails: '/get-user-details',

    // team
    getTeamMembers: '/get-team-members',
    addTeamMember: '/add-team-member',
    updateTeamMember: '/update-team-member',
    
    // services
    getAllServices: '/get-all-services',
    addService: '/add-service',
    
    // service status
    getAllServiceStatus: '/get-all-service-status',
    addServiceStatus: '/add-service-status',
    updateServiceStatus: '/update-service-status',

    // incidents
    addIncident: '/add-incident',
    updateIncident: '/update-incident',
    getOpenIncidents: '/get-open-incidents',
    resolveIncident: '/resolve-incident',

    // maintenance
    toggleMaintenance: '/toggle-service-maintenance',
}