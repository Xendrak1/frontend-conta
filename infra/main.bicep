targetScope = 'subscription'

@minLength(1)
@maxLength(64)
@description('Nombre del entorno de despliegue (máx. 64 caracteres)')
param environmentName string

@minLength(1)
@description('Ubicación primaria para todos los recursos')
param location string = 'West US 2'

@description('Nombre del grupo de recursos existente')
param resourceGroupName string = 'contabilidadwebapp_group'

@description('Repository URL de GitHub')
param repositoryUrl string = 'https://github.com/Xendrak1/frontend-conta'

@description('Branch del repositorio')
param repositoryBranch string = 'main'

// Token único para nombres de recursos
var resourceToken = uniqueString(subscription().id, location, environmentName)

// Nombres de recursos con prefijos y token único
var staticWebAppName = 'azswa${resourceToken}'
var logAnalyticsName = 'azlog${resourceToken}'
var applicationInsightsName = 'azai${resourceToken}'
var managedIdentityName = 'azmi${resourceToken}'

// Referencia al grupo de recursos existente
resource existingResourceGroup 'Microsoft.Resources/resourceGroups@2023-07-01' existing = {
  name: resourceGroupName
}

// Tags requeridos por AZD
var tags = {
  'azd-env-name': environmentName
}

var staticWebAppTags = {
  'azd-env-name': environmentName
  'azd-service-name': 'next-conta'
}

// User-Assigned Managed Identity (requerido por AZD)
resource managedIdentity 'Microsoft.ManagedIdentity/userAssignedIdentities@2023-01-31' = {
  name: managedIdentityName
  location: location
  scope: existingResourceGroup
  tags: tags
}

// Log Analytics Workspace
resource logAnalytics 'Microsoft.OperationalInsights/workspaces@2023-09-01' = {
  name: logAnalyticsName
  location: location
  scope: existingResourceGroup
  tags: tags
  properties: {
    sku: {
      name: 'PerGB2018'
    }
    retentionInDays: 30
  }
}

// Application Insights
resource applicationInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: applicationInsightsName
  location: location
  scope: existingResourceGroup
  tags: tags
  kind: 'web'
  properties: {
    Application_Type: 'web'
    WorkspaceResourceId: logAnalytics.id
  }
}

// Azure Static Web App
resource staticWebApp 'Microsoft.Web/staticSites@2023-12-01' = {
  name: staticWebAppName
  location: location
  scope: existingResourceGroup
  tags: staticWebAppTags
  identity: {
    type: 'UserAssigned'
    userAssignedIdentities: {
      '${managedIdentity.id}': {}
    }
  }
  sku: {
    name: 'Free'
    tier: 'Free'
  }
  properties: {
    repositoryUrl: repositoryUrl
    branch: repositoryBranch
    buildProperties: {
      appLocation: '/'
      apiLocation: ''
      outputLocation: 'out'
      appBuildCommand: 'npm run build'
      apiBuildCommand: ''
    }
    stagingEnvironmentPolicy: 'Enabled'
    allowConfigFileUpdates: true
    provider: 'GitHub'
    enterpriseGradeCdnStatus: 'Disabled'
  }
}

// Outputs requeridos por AZD
output RESOURCE_GROUP_ID string = existingResourceGroup.id
output AZURE_LOCATION string = location
output APPLICATIONINSIGHTS_CONNECTION_STRING string = applicationInsights.properties.ConnectionString
output APPLICATIONINSIGHTS_NAME string = applicationInsights.name
output AZURE_LOG_ANALYTICS_WORKSPACE_NAME string = logAnalytics.name
output AZURE_LOG_ANALYTICS_WORKSPACE_ID string = logAnalytics.id
output AZURE_MANAGED_IDENTITY_CLIENT_ID string = managedIdentity.properties.clientId
output AZURE_MANAGED_IDENTITY_NAME string = managedIdentity.name
output SERVICE_NEXTCONTA_IDENTITY_PRINCIPAL_ID string = managedIdentity.properties.principalId
output SERVICE_NEXTCONTA_NAME string = staticWebApp.name
output SERVICE_NEXTCONTA_URI string = 'https://${staticWebApp.properties.defaultHostname}'
output AZURE_STATIC_WEB_APPS_API_TOKEN string = staticWebApp.listSecrets().properties.apiKey