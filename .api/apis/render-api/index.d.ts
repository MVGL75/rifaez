import type * as types from './types';
import type { ConfigOptions, FetchResponse } from 'api/dist/core';
import Oas from 'oas';
import APICore from 'api/dist/core';
declare class SDK {
    spec: Oas;
    core: APICore;
    constructor();
    /**
     * Optionally configure various options that the SDK allows.
     *
     * @param config Object of supported SDK options and toggles.
     * @param config.timeout Override the default `fetch` request timeout of 30 seconds. This number
     * should be represented in milliseconds.
     */
    config(config: ConfigOptions): void;
    /**
     * If the API you're using requires authentication you can supply the required credentials
     * through this method and the library will magically determine how they should be used
     * within your API request.
     *
     * With the exception of OpenID and MutualTLS, it supports all forms of authentication
     * supported by the OpenAPI specification.
     *
     * @example <caption>HTTP Basic auth</caption>
     * sdk.auth('username', 'password');
     *
     * @example <caption>Bearer tokens (HTTP or OAuth 2)</caption>
     * sdk.auth('myBearerToken');
     *
     * @example <caption>API Keys</caption>
     * sdk.auth('myApiKey');
     *
     * @see {@link https://spec.openapis.org/oas/v3.0.3#fixed-fields-22}
     * @see {@link https://spec.openapis.org/oas/v3.1.0#fixed-fields-22}
     * @param values Your auth credentials for the API; can specify up to two strings or numbers.
     */
    auth(...values: string[] | number[]): this;
    /**
     * If the API you're using offers alternate server URLs, and server variables, you can tell
     * the SDK which one to use with this method. To use it you can supply either one of the
     * server URLs that are contained within the OpenAPI definition (along with any server
     * variables), or you can pass it a fully qualified URL to use (that may or may not exist
     * within the OpenAPI definition).
     *
     * @example <caption>Server URL with server variables</caption>
     * sdk.server('https://{region}.api.example.com/{basePath}', {
     *   name: 'eu',
     *   basePath: 'v14',
     * });
     *
     * @example <caption>Fully qualified server URL</caption>
     * sdk.server('https://eu.api.example.com/v14');
     *
     * @param url Server URL
     * @param variables An object of variables to replace into the server URL.
     */
    server(url: string, variables?: {}): void;
    /**
     * List blueprints for the specified workspaces. If no workspaces are provided, returns all
     * blueprints the API key has access to.
     *
     * @summary List blueprints
     * @throws FetchError<401, types.ListBlueprintsResponse401> Authorization information is missing or invalid.
     * @throws FetchError<403, types.ListBlueprintsResponse403> You do not have permissions for the requested resource.
     * @throws FetchError<404, types.ListBlueprintsResponse404> Unable to find the requested resource.
     * @throws FetchError<406, types.ListBlueprintsResponse406> Unable to generate preferred media types as specified by Accept request header.
     * @throws FetchError<410, types.ListBlueprintsResponse410> The requested resource is no longer available.
     * @throws FetchError<429, types.ListBlueprintsResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.ListBlueprintsResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.ListBlueprintsResponse503> Server currently unavailable.
     */
    listBlueprints(metadata?: types.ListBlueprintsMetadataParam): Promise<FetchResponse<200, types.ListBlueprintsResponse200>>;
    /**
     * Retrieve the blueprint with the provided ID.
     *
     * @summary Retrieve blueprint
     * @throws FetchError<401, types.RetrieveBlueprintResponse401> Authorization information is missing or invalid.
     * @throws FetchError<403, types.RetrieveBlueprintResponse403> You do not have permissions for the requested resource.
     * @throws FetchError<404, types.RetrieveBlueprintResponse404> Unable to find the requested resource.
     * @throws FetchError<406, types.RetrieveBlueprintResponse406> Unable to generate preferred media types as specified by Accept request header.
     * @throws FetchError<410, types.RetrieveBlueprintResponse410> The requested resource is no longer available.
     * @throws FetchError<429, types.RetrieveBlueprintResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.RetrieveBlueprintResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.RetrieveBlueprintResponse503> Server currently unavailable.
     */
    retrieveBlueprint(metadata: types.RetrieveBlueprintMetadataParam): Promise<FetchResponse<200, types.RetrieveBlueprintResponse200>>;
    /**
     * Update the blueprint with the provided ID.
     *
     * @summary Update blueprint
     * @throws FetchError<401, types.UpdateBlueprintResponse401> Authorization information is missing or invalid.
     * @throws FetchError<403, types.UpdateBlueprintResponse403> You do not have permissions for the requested resource.
     * @throws FetchError<404, types.UpdateBlueprintResponse404> Unable to find the requested resource.
     * @throws FetchError<406, types.UpdateBlueprintResponse406> Unable to generate preferred media types as specified by Accept request header.
     * @throws FetchError<410, types.UpdateBlueprintResponse410> The requested resource is no longer available.
     * @throws FetchError<429, types.UpdateBlueprintResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.UpdateBlueprintResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.UpdateBlueprintResponse503> Server currently unavailable.
     */
    updateBlueprint(body: types.UpdateBlueprintBodyParam, metadata: types.UpdateBlueprintMetadataParam): Promise<FetchResponse<200, types.UpdateBlueprintResponse200>>;
    /**
     * Disconnect the blueprint with the provided ID.
     *
     * Disconnecting a blueprint stops automatic resource syncing via the associated
     * `render.yaml` file. It does not _delete_ any services or other resources that were
     * managed by the blueprint.
     *
     * @summary Disconnect blueprint
     * @throws FetchError<401, types.DisconnectBlueprintResponse401> Authorization information is missing or invalid.
     * @throws FetchError<403, types.DisconnectBlueprintResponse403> You do not have permissions for the requested resource.
     * @throws FetchError<404, types.DisconnectBlueprintResponse404> Unable to find the requested resource.
     * @throws FetchError<406, types.DisconnectBlueprintResponse406> Unable to generate preferred media types as specified by Accept request header.
     * @throws FetchError<410, types.DisconnectBlueprintResponse410> The requested resource is no longer available.
     * @throws FetchError<429, types.DisconnectBlueprintResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.DisconnectBlueprintResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.DisconnectBlueprintResponse503> Server currently unavailable.
     */
    disconnectBlueprint(metadata: types.DisconnectBlueprintMetadataParam): Promise<FetchResponse<number, unknown>>;
    /**
     * List syncs for the blueprint with the provided ID.
     *
     * @summary List blueprint syncs
     * @throws FetchError<401, types.ListBlueprintSyncsResponse401> Authorization information is missing or invalid.
     * @throws FetchError<403, types.ListBlueprintSyncsResponse403> You do not have permissions for the requested resource.
     * @throws FetchError<404, types.ListBlueprintSyncsResponse404> Unable to find the requested resource.
     * @throws FetchError<406, types.ListBlueprintSyncsResponse406> Unable to generate preferred media types as specified by Accept request header.
     * @throws FetchError<410, types.ListBlueprintSyncsResponse410> The requested resource is no longer available.
     * @throws FetchError<429, types.ListBlueprintSyncsResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.ListBlueprintSyncsResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.ListBlueprintSyncsResponse503> Server currently unavailable.
     */
    listBlueprintSyncs(metadata: types.ListBlueprintSyncsMetadataParam): Promise<FetchResponse<200, types.ListBlueprintSyncsResponse200>>;
    /**
     * List persistent disks matching the provided filters. If no filters are provided, returns
     * all disks you have permissions to view.
     *
     * @summary List disks
     * @throws FetchError<401, types.ListDisksResponse401> Authorization information is missing or invalid.
     * @throws FetchError<403, types.ListDisksResponse403> You do not have permissions for the requested resource.
     * @throws FetchError<404, types.ListDisksResponse404> Unable to find the requested resource.
     * @throws FetchError<406, types.ListDisksResponse406> Unable to generate preferred media types as specified by Accept request header.
     * @throws FetchError<410, types.ListDisksResponse410> The requested resource is no longer available.
     * @throws FetchError<429, types.ListDisksResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.ListDisksResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.ListDisksResponse503> Server currently unavailable.
     */
    listDisks(metadata?: types.ListDisksMetadataParam): Promise<FetchResponse<200, types.ListDisksResponse200>>;
    /**
     * Attach a persistent disk to a web service, private service, or background worker.
     *
     * The service must be redeployed for the disk to be attached.
     *
     * @summary Add disk
     * @throws FetchError<400, types.AddDiskResponse400> The request could not be understood by the server.
     * @throws FetchError<401, types.AddDiskResponse401> Authorization information is missing or invalid.
     * @throws FetchError<403, types.AddDiskResponse403> You do not have permissions for the requested resource.
     * @throws FetchError<404, types.AddDiskResponse404> Unable to find the requested resource.
     * @throws FetchError<406, types.AddDiskResponse406> Unable to generate preferred media types as specified by Accept request header.
     * @throws FetchError<410, types.AddDiskResponse410> The requested resource is no longer available.
     * @throws FetchError<429, types.AddDiskResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.AddDiskResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.AddDiskResponse503> Server currently unavailable.
     */
    addDisk(body: types.AddDiskBodyParam): Promise<FetchResponse<201, types.AddDiskResponse201>>;
    /**
     * Retrieve the persistent disk with the provided ID.
     *
     * @summary Retrieve disk
     * @throws FetchError<401, types.RetrieveDiskResponse401> Authorization information is missing or invalid.
     * @throws FetchError<403, types.RetrieveDiskResponse403> You do not have permissions for the requested resource.
     * @throws FetchError<404, types.RetrieveDiskResponse404> Unable to find the requested resource.
     * @throws FetchError<406, types.RetrieveDiskResponse406> Unable to generate preferred media types as specified by Accept request header.
     * @throws FetchError<410, types.RetrieveDiskResponse410> The requested resource is no longer available.
     * @throws FetchError<429, types.RetrieveDiskResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.RetrieveDiskResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.RetrieveDiskResponse503> Server currently unavailable.
     */
    retrieveDisk(metadata: types.RetrieveDiskMetadataParam): Promise<FetchResponse<200, types.RetrieveDiskResponse200>>;
    /**
     * Update the persistent disk with the provided ID.
     *
     * The disk's associated service must be deployed and active for updates to take effect.
     *
     * When resizing a disk, the new size must be greater than the current size.
     *
     * @summary Update disk
     * @throws FetchError<400, types.UpdateDiskResponse400> The request could not be understood by the server.
     * @throws FetchError<401, types.UpdateDiskResponse401> Authorization information is missing or invalid.
     * @throws FetchError<403, types.UpdateDiskResponse403> You do not have permissions for the requested resource.
     * @throws FetchError<404, types.UpdateDiskResponse404> Unable to find the requested resource.
     * @throws FetchError<406, types.UpdateDiskResponse406> Unable to generate preferred media types as specified by Accept request header.
     * @throws FetchError<410, types.UpdateDiskResponse410> The requested resource is no longer available.
     * @throws FetchError<429, types.UpdateDiskResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.UpdateDiskResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.UpdateDiskResponse503> Server currently unavailable.
     */
    updateDisk(body: types.UpdateDiskBodyParam, metadata: types.UpdateDiskMetadataParam): Promise<FetchResponse<200, types.UpdateDiskResponse200>>;
    /**
     * Delete a persistent disk attached to a service.
     *
     * **All data on the disk will be lost.** The disk's associated service will immediately
     * lose access to it.
     *
     * @summary Delete disk
     * @throws FetchError<401, types.DeleteDiskResponse401> Authorization information is missing or invalid.
     * @throws FetchError<403, types.DeleteDiskResponse403> You do not have permissions for the requested resource.
     * @throws FetchError<404, types.DeleteDiskResponse404> Unable to find the requested resource.
     * @throws FetchError<406, types.DeleteDiskResponse406> Unable to generate preferred media types as specified by Accept request header.
     * @throws FetchError<410, types.DeleteDiskResponse410> The requested resource is no longer available.
     * @throws FetchError<429, types.DeleteDiskResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.DeleteDiskResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.DeleteDiskResponse503> Server currently unavailable.
     */
    deleteDisk(metadata: types.DeleteDiskMetadataParam): Promise<FetchResponse<number, unknown>>;
    /**
     * List snapshots for the persistent disk with the provided ID. Each snapshot is a
     * point-in-time copy of the disk's data.
     *
     * @summary List snapshots
     * @throws FetchError<400, types.ListSnapshotsResponse400> The request could not be understood by the server.
     * @throws FetchError<401, types.ListSnapshotsResponse401> Authorization information is missing or invalid.
     * @throws FetchError<403, types.ListSnapshotsResponse403> You do not have permissions for the requested resource.
     * @throws FetchError<404, types.ListSnapshotsResponse404> Unable to find the requested resource.
     * @throws FetchError<406, types.ListSnapshotsResponse406> Unable to generate preferred media types as specified by Accept request header.
     * @throws FetchError<410, types.ListSnapshotsResponse410> The requested resource is no longer available.
     * @throws FetchError<429, types.ListSnapshotsResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.ListSnapshotsResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.ListSnapshotsResponse503> Server currently unavailable.
     */
    listSnapshots(metadata: types.ListSnapshotsMetadataParam): Promise<FetchResponse<201, types.ListSnapshotsResponse201>>;
    /**
     * Restore a persistent disk to an available snapshot.
     *
     * **This operation is irreversible.** It will overwrite the current disk data. It might
     * also trigger a service deploy.
     *
     * Snapshot keys returned from the [List
     * snapshots](https://api-docs.render.com/reference/list-snapshots) endpoint expire after
     * 24 hours. If a snapshot key has expired, query the endpoint again for a new key.
     *
     * @summary Restore snapshot
     * @throws FetchError<400, types.RestoreSnapshotResponse400> The request could not be understood by the server.
     * @throws FetchError<401, types.RestoreSnapshotResponse401> Authorization information is missing or invalid.
     * @throws FetchError<403, types.RestoreSnapshotResponse403> You do not have permissions for the requested resource.
     * @throws FetchError<404, types.RestoreSnapshotResponse404> Unable to find the requested resource.
     * @throws FetchError<406, types.RestoreSnapshotResponse406> Unable to generate preferred media types as specified by Accept request header.
     * @throws FetchError<410, types.RestoreSnapshotResponse410> The requested resource is no longer available.
     * @throws FetchError<429, types.RestoreSnapshotResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.RestoreSnapshotResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.RestoreSnapshotResponse503> Server currently unavailable.
     */
    restoreSnapshot(body: types.RestoreSnapshotBodyParam, metadata: types.RestoreSnapshotMetadataParam): Promise<FetchResponse<200, types.RestoreSnapshotResponse200>>;
    /**
     * Retrieve the user associated with the provided API key.
     *
     * @summary Get the authenticated user
     * @throws FetchError<401, types.GetUserResponse401> Authorization information is missing or invalid.
     * @throws FetchError<406, types.GetUserResponse406> Unable to generate preferred media types as specified by Accept request header.
     * @throws FetchError<429, types.GetUserResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.GetUserResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.GetUserResponse503> Server currently unavailable.
     */
    getUser(): Promise<FetchResponse<200, types.GetUserResponse200>>;
    /**
     * List the workspaces that your API key has access to, optionally filtered by name or
     * owner email address.
     *
     * @summary List workspaces
     * @throws FetchError<401, types.ListOwnersResponse401> Authorization information is missing or invalid.
     * @throws FetchError<406, types.ListOwnersResponse406> Unable to generate preferred media types as specified by Accept request header.
     * @throws FetchError<429, types.ListOwnersResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.ListOwnersResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.ListOwnersResponse503> Server currently unavailable.
     */
    listOwners(metadata?: types.ListOwnersMetadataParam): Promise<FetchResponse<200, types.ListOwnersResponse200>>;
    /**
     * Retrieve the workspace with the provided ID.
     *
     * Workspace IDs start with `tea-`. If you provide a user ID (starts with `own-`), this
     * endpoint returns the user's default workspace.
     *
     * @summary Retrieve workspace
     * @throws FetchError<401, types.RetrieveOwnerResponse401> Authorization information is missing or invalid.
     * @throws FetchError<404, types.RetrieveOwnerResponse404> Unable to find the requested resource.
     * @throws FetchError<406, types.RetrieveOwnerResponse406> Unable to generate preferred media types as specified by Accept request header.
     * @throws FetchError<410, types.RetrieveOwnerResponse410> The requested resource is no longer available.
     * @throws FetchError<429, types.RetrieveOwnerResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.RetrieveOwnerResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.RetrieveOwnerResponse503> Server currently unavailable.
     */
    retrieveOwner(metadata: types.RetrieveOwnerMetadataParam): Promise<FetchResponse<200, types.RetrieveOwnerResponse200>>;
    /**
     * Retrieves the list of users belonging to the workspace with the provided ID.
     *
     * @summary List workspace members
     * @throws FetchError<401, types.RetrieveOwnerMembersResponse401> Authorization information is missing or invalid.
     * @throws FetchError<404, types.RetrieveOwnerMembersResponse404> Unable to find the requested resource.
     * @throws FetchError<406, types.RetrieveOwnerMembersResponse406> Unable to generate preferred media types as specified by Accept request header.
     * @throws FetchError<410, types.RetrieveOwnerMembersResponse410> The requested resource is no longer available.
     * @throws FetchError<429, types.RetrieveOwnerMembersResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.RetrieveOwnerMembersResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.RetrieveOwnerMembersResponse503> Server currently unavailable.
     */
    retrieveOwnerMembers(metadata: types.RetrieveOwnerMembersMetadataParam): Promise<FetchResponse<200, types.RetrieveOwnerMembersResponse200>>;
    /**
     * Retrieve notification settings for the owner with the provided ID.
     *
     * Note that you provide an owner ID to this endpoint, not the ID for a particular
     * resource.
     *
     * @summary Retrieve notification settings
     * @throws FetchError<401, types.RetrieveOwnerNotificationSettingsResponse401> Authorization information is missing or invalid.
     * @throws FetchError<406, types.RetrieveOwnerNotificationSettingsResponse406> Unable to generate preferred media types as specified by Accept request header.
     * @throws FetchError<429, types.RetrieveOwnerNotificationSettingsResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.RetrieveOwnerNotificationSettingsResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.RetrieveOwnerNotificationSettingsResponse503> Server currently unavailable.
     */
    retrieveOwnerNotificationSettings(metadata: types.RetrieveOwnerNotificationSettingsMetadataParam): Promise<FetchResponse<200, types.RetrieveOwnerNotificationSettingsResponse200>>;
    /**
     * Update notification settings for the owner with the provided ID.
     *
     * @summary Update notification settings
     * @throws FetchError<401, types.PatchOwnerNotificationSettingsResponse401> Authorization information is missing or invalid.
     * @throws FetchError<406, types.PatchOwnerNotificationSettingsResponse406> Unable to generate preferred media types as specified by Accept request header.
     * @throws FetchError<429, types.PatchOwnerNotificationSettingsResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.PatchOwnerNotificationSettingsResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.PatchOwnerNotificationSettingsResponse503> Server currently unavailable.
     */
    patchOwnerNotificationSettings(body: types.PatchOwnerNotificationSettingsBodyParam, metadata: types.PatchOwnerNotificationSettingsMetadataParam): Promise<FetchResponse<200, types.PatchOwnerNotificationSettingsResponse200>>;
    /**
     * List notification overrides matching the provided filters. If no filters are provided,
     * returns all notification overrides for all workspaces the user belongs to.
     *
     * @summary List notification overrides
     * @throws FetchError<401, types.ListNotificationOverridesResponse401> Authorization information is missing or invalid.
     * @throws FetchError<406, types.ListNotificationOverridesResponse406> Unable to generate preferred media types as specified by Accept request header.
     * @throws FetchError<429, types.ListNotificationOverridesResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.ListNotificationOverridesResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.ListNotificationOverridesResponse503> Server currently unavailable.
     */
    listNotificationOverrides(metadata?: types.ListNotificationOverridesMetadataParam): Promise<FetchResponse<200, types.ListNotificationOverridesResponse200>>;
    /**
     * Retrieve the notification override for the service with the provided ID.
     *
     * Note that you provide a service ID to this endpoint, not the ID for a particular
     * override.
     *
     * @summary Retrieve notification override
     * @throws FetchError<401, types.RetrieveServiceNotificationOverridesResponse401> Authorization information is missing or invalid.
     * @throws FetchError<406, types.RetrieveServiceNotificationOverridesResponse406> Unable to generate preferred media types as specified by Accept request header.
     * @throws FetchError<429, types.RetrieveServiceNotificationOverridesResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.RetrieveServiceNotificationOverridesResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.RetrieveServiceNotificationOverridesResponse503> Server currently unavailable.
     */
    retrieveServiceNotificationOverrides(metadata: types.RetrieveServiceNotificationOverridesMetadataParam): Promise<FetchResponse<200, types.RetrieveServiceNotificationOverridesResponse200>>;
    /**
     * Update the notification override for the service with the provided ID.
     *
     * @summary Update notification override
     * @throws FetchError<401, types.PatchServiceNotificationOverridesResponse401> Authorization information is missing or invalid.
     * @throws FetchError<406, types.PatchServiceNotificationOverridesResponse406> Unable to generate preferred media types as specified by Accept request header.
     * @throws FetchError<429, types.PatchServiceNotificationOverridesResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.PatchServiceNotificationOverridesResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.PatchServiceNotificationOverridesResponse503> Server currently unavailable.
     */
    patchServiceNotificationOverrides(body: types.PatchServiceNotificationOverridesBodyParam, metadata: types.PatchServiceNotificationOverridesMetadataParam): Promise<FetchResponse<200, types.PatchServiceNotificationOverridesResponse200>>;
    /**
     * List registry credentials matching the provided filters. If no filters are provided,
     * returns all registry credentials you have permissions to view.
     *
     * @summary List registry credentials
     * @throws FetchError<401, types.ListRegistryCredentialsResponse401> Authorization information is missing or invalid.
     * @throws FetchError<406, types.ListRegistryCredentialsResponse406> Unable to generate preferred media types as specified by Accept request header.
     * @throws FetchError<429, types.ListRegistryCredentialsResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.ListRegistryCredentialsResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.ListRegistryCredentialsResponse503> Server currently unavailable.
     */
    listRegistryCredentials(metadata?: types.ListRegistryCredentialsMetadataParam): Promise<FetchResponse<200, types.ListRegistryCredentialsResponse200>>;
    /**
     * Create a new registry credential.
     *
     * @summary Create registry credential
     * @throws FetchError<400, types.CreateRegistryCredentialResponse400> The request could not be understood by the server.
     * @throws FetchError<401, types.CreateRegistryCredentialResponse401> Authorization information is missing or invalid.
     * @throws FetchError<402, types.CreateRegistryCredentialResponse402> You must enter payment information to perform this request.
     * @throws FetchError<406, types.CreateRegistryCredentialResponse406> Unable to generate preferred media types as specified by Accept request header.
     * @throws FetchError<409, types.CreateRegistryCredentialResponse409> The current state of the resource conflicts with this request.
     * @throws FetchError<429, types.CreateRegistryCredentialResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.CreateRegistryCredentialResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.CreateRegistryCredentialResponse503> Server currently unavailable.
     */
    createRegistryCredential(body: types.CreateRegistryCredentialBodyParam): Promise<FetchResponse<200, types.CreateRegistryCredentialResponse200>>;
    /**
     * Retrieve the registry credential with the provided ID.
     *
     * @summary Retrieve registry credential
     * @throws FetchError<401, types.RetrieveRegistryCredentialResponse401> Authorization information is missing or invalid.
     * @throws FetchError<403, types.RetrieveRegistryCredentialResponse403> You do not have permissions for the requested resource.
     * @throws FetchError<404, types.RetrieveRegistryCredentialResponse404> Unable to find the requested resource.
     * @throws FetchError<406, types.RetrieveRegistryCredentialResponse406> Unable to generate preferred media types as specified by Accept request header.
     * @throws FetchError<410, types.RetrieveRegistryCredentialResponse410> The requested resource is no longer available.
     * @throws FetchError<429, types.RetrieveRegistryCredentialResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.RetrieveRegistryCredentialResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.RetrieveRegistryCredentialResponse503> Server currently unavailable.
     */
    retrieveRegistryCredential(metadata: types.RetrieveRegistryCredentialMetadataParam): Promise<FetchResponse<200, types.RetrieveRegistryCredentialResponse200>>;
    /**
     * Update the registry credential with the provided ID. Services that use this credential
     * must be redeployed to use updated values.
     *
     * @summary Update registry credential
     * @throws FetchError<400, types.UpdateRegistryCredentialResponse400> The request could not be understood by the server.
     * @throws FetchError<401, types.UpdateRegistryCredentialResponse401> Authorization information is missing or invalid.
     * @throws FetchError<402, types.UpdateRegistryCredentialResponse402> You must enter payment information to perform this request.
     * @throws FetchError<403, types.UpdateRegistryCredentialResponse403> You do not have permissions for the requested resource.
     * @throws FetchError<404, types.UpdateRegistryCredentialResponse404> Unable to find the requested resource.
     * @throws FetchError<406, types.UpdateRegistryCredentialResponse406> Unable to generate preferred media types as specified by Accept request header.
     * @throws FetchError<409, types.UpdateRegistryCredentialResponse409> The current state of the resource conflicts with this request.
     * @throws FetchError<410, types.UpdateRegistryCredentialResponse410> The requested resource is no longer available.
     * @throws FetchError<429, types.UpdateRegistryCredentialResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.UpdateRegistryCredentialResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.UpdateRegistryCredentialResponse503> Server currently unavailable.
     */
    updateRegistryCredential(body: types.UpdateRegistryCredentialBodyParam, metadata: types.UpdateRegistryCredentialMetadataParam): Promise<FetchResponse<200, types.UpdateRegistryCredentialResponse200>>;
    /**
     * Delete the registry credential with the provided ID.
     *
     * @summary Delete registry credential
     * @throws FetchError<401, types.DeleteRegistryCredentialResponse401> Authorization information is missing or invalid.
     * @throws FetchError<403, types.DeleteRegistryCredentialResponse403> You do not have permissions for the requested resource.
     * @throws FetchError<404, types.DeleteRegistryCredentialResponse404> Unable to find the requested resource.
     * @throws FetchError<406, types.DeleteRegistryCredentialResponse406> Unable to generate preferred media types as specified by Accept request header.
     * @throws FetchError<410, types.DeleteRegistryCredentialResponse410> The requested resource is no longer available.
     * @throws FetchError<429, types.DeleteRegistryCredentialResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.DeleteRegistryCredentialResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.DeleteRegistryCredentialResponse503> Server currently unavailable.
     */
    deleteRegistryCredential(metadata: types.DeleteRegistryCredentialMetadataParam): Promise<FetchResponse<number, unknown>>;
    /**
     * List services matching the provided filters. If no filters are provided, returns all
     * services you have permissions to view.
     *
     * @summary List services
     * @throws FetchError<401, types.ListServicesResponse401> Authorization information is missing or invalid.
     * @throws FetchError<406, types.ListServicesResponse406> Unable to generate preferred media types as specified by Accept request header.
     * @throws FetchError<429, types.ListServicesResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.ListServicesResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.ListServicesResponse503> Server currently unavailable.
     */
    listServices(metadata?: types.ListServicesMetadataParam): Promise<FetchResponse<200, types.ListServicesResponse200>>;
    /**
     * Create a service.
     *
     * @summary Create service
     * @throws FetchError<400, types.CreateServiceResponse400> The request could not be understood by the server.
     * @throws FetchError<401, types.CreateServiceResponse401> Authorization information is missing or invalid.
     * @throws FetchError<402, types.CreateServiceResponse402> You must enter payment information to perform this request.
     * @throws FetchError<406, types.CreateServiceResponse406> Unable to generate preferred media types as specified by Accept request header.
     * @throws FetchError<409, types.CreateServiceResponse409> The current state of the resource conflicts with this request.
     * @throws FetchError<429, types.CreateServiceResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.CreateServiceResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.CreateServiceResponse503> Server currently unavailable.
     */
    createService(body: types.CreateServiceBodyParam): Promise<FetchResponse<201, types.CreateServiceResponse201>>;
    /**
     * Retrieve the service with the provided ID.
     *
     * @summary Retrieve service
     * @throws FetchError<401, types.RetrieveServiceResponse401> Authorization information is missing or invalid.
     * @throws FetchError<403, types.RetrieveServiceResponse403> You do not have permissions for the requested resource.
     * @throws FetchError<404, types.RetrieveServiceResponse404> Unable to find the requested resource.
     * @throws FetchError<406, types.RetrieveServiceResponse406> Unable to generate preferred media types as specified by Accept request header.
     * @throws FetchError<410, types.RetrieveServiceResponse410> The requested resource is no longer available.
     * @throws FetchError<429, types.RetrieveServiceResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.RetrieveServiceResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.RetrieveServiceResponse503> Server currently unavailable.
     */
    retrieveService(metadata: types.RetrieveServiceMetadataParam): Promise<FetchResponse<200, types.RetrieveServiceResponse200>>;
    /**
     * Update the service with the provided ID.
     *
     * @summary Update service
     * @throws FetchError<400, types.UpdateServiceResponse400> The request could not be understood by the server.
     * @throws FetchError<401, types.UpdateServiceResponse401> Authorization information is missing or invalid.
     * @throws FetchError<402, types.UpdateServiceResponse402> You must enter payment information to perform this request.
     * @throws FetchError<403, types.UpdateServiceResponse403> You do not have permissions for the requested resource.
     * @throws FetchError<404, types.UpdateServiceResponse404> Unable to find the requested resource.
     * @throws FetchError<406, types.UpdateServiceResponse406> Unable to generate preferred media types as specified by Accept request header.
     * @throws FetchError<409, types.UpdateServiceResponse409> The current state of the resource conflicts with this request.
     * @throws FetchError<410, types.UpdateServiceResponse410> The requested resource is no longer available.
     * @throws FetchError<429, types.UpdateServiceResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.UpdateServiceResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.UpdateServiceResponse503> Server currently unavailable.
     */
    updateService(body: types.UpdateServiceBodyParam, metadata: types.UpdateServiceMetadataParam): Promise<FetchResponse<200, types.UpdateServiceResponse200>>;
    /**
     * Delete the service with the provided ID.
     *
     * @summary Delete service
     * @throws FetchError<401, types.DeleteServiceResponse401> Authorization information is missing or invalid.
     * @throws FetchError<403, types.DeleteServiceResponse403> You do not have permissions for the requested resource.
     * @throws FetchError<404, types.DeleteServiceResponse404> Unable to find the requested resource.
     * @throws FetchError<406, types.DeleteServiceResponse406> Unable to generate preferred media types as specified by Accept request header.
     * @throws FetchError<410, types.DeleteServiceResponse410> The requested resource is no longer available.
     * @throws FetchError<429, types.DeleteServiceResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.DeleteServiceResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.DeleteServiceResponse503> Server currently unavailable.
     */
    deleteService(metadata: types.DeleteServiceMetadataParam): Promise<FetchResponse<number, unknown>>;
    /**
     * List deploys matching the provided filters. If no filters are provided, all deploys for
     * the service are returned.
     *
     * @summary List deploys
     * @throws FetchError<401, types.ListDeploysResponse401> Authorization information is missing or invalid.
     * @throws FetchError<403, types.ListDeploysResponse403> You do not have permissions for the requested resource.
     * @throws FetchError<404, types.ListDeploysResponse404> Unable to find the requested resource.
     * @throws FetchError<406, types.ListDeploysResponse406> Unable to generate preferred media types as specified by Accept request header.
     * @throws FetchError<410, types.ListDeploysResponse410> The requested resource is no longer available.
     * @throws FetchError<429, types.ListDeploysResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.ListDeploysResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.ListDeploysResponse503> Server currently unavailable.
     */
    listDeploys(metadata: types.ListDeploysMetadataParam): Promise<FetchResponse<200, types.ListDeploysResponse200>>;
    /**
     * Trigger a deploy for the service with the provided ID.
     *
     * @summary Trigger deploy
     * @throws FetchError<400, types.CreateDeployResponse400> The request could not be understood by the server.
     * @throws FetchError<401, types.CreateDeployResponse401> Authorization information is missing or invalid.
     * @throws FetchError<404, types.CreateDeployResponse404> Unable to find the requested resource.
     * @throws FetchError<406, types.CreateDeployResponse406> Unable to generate preferred media types as specified by Accept request header.
     * @throws FetchError<409, types.CreateDeployResponse409> The current state of the resource conflicts with this request.
     * @throws FetchError<410, types.CreateDeployResponse410> The requested resource is no longer available.
     * @throws FetchError<429, types.CreateDeployResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.CreateDeployResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.CreateDeployResponse503> Server currently unavailable.
     */
    createDeploy(body: types.CreateDeployBodyParam, metadata: types.CreateDeployMetadataParam): Promise<FetchResponse<201, types.CreateDeployResponse201>>;
    /**
     * Retrieve the details of a particular deploy for a particular service.
     *
     * @summary Retrieve deploy
     * @throws FetchError<401, types.RetrieveDeployResponse401> Authorization information is missing or invalid.
     * @throws FetchError<403, types.RetrieveDeployResponse403> You do not have permissions for the requested resource.
     * @throws FetchError<404, types.RetrieveDeployResponse404> Unable to find the requested resource.
     * @throws FetchError<406, types.RetrieveDeployResponse406> Unable to generate preferred media types as specified by Accept request header.
     * @throws FetchError<410, types.RetrieveDeployResponse410> The requested resource is no longer available.
     * @throws FetchError<429, types.RetrieveDeployResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.RetrieveDeployResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.RetrieveDeployResponse503> Server currently unavailable.
     */
    retrieveDeploy(metadata: types.RetrieveDeployMetadataParam): Promise<FetchResponse<200, types.RetrieveDeployResponse200>>;
    /**
     * Cancel an in-progress deploy for a service.
     *
     * Not supported for cron jobs.
     *
     * @summary Cancel deploy
     * @throws FetchError<400, types.CancelDeployResponse400> The request could not be understood by the server.
     * @throws FetchError<401, types.CancelDeployResponse401> Authorization information is missing or invalid.
     * @throws FetchError<403, types.CancelDeployResponse403> You do not have permissions for the requested resource.
     * @throws FetchError<404, types.CancelDeployResponse404> Unable to find the requested resource.
     * @throws FetchError<429, types.CancelDeployResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.CancelDeployResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.CancelDeployResponse503> Server currently unavailable.
     */
    cancelDeploy(metadata: types.CancelDeployMetadataParam): Promise<FetchResponse<200, types.CancelDeployResponse200>>;
    /**
     * Trigger a rollback to a previous deploy of the specified service.
     *
     * Triggering a rollback with this endpoint does not disable autodeploys for the service.
     * This means an autodeploy might restore changes you had intentionally rolled back.
     *
     * You can toggle autodeploys for your service with the [Update
     * service](https://api-docs.render.com/reference/update-service) endpoint or in the Render
     * Dashboard.
     *
     * @summary Roll back deploy
     * @throws FetchError<400, types.RollbackDeployResponse400> The request could not be understood by the server.
     * @throws FetchError<401, types.RollbackDeployResponse401> Authorization information is missing or invalid.
     * @throws FetchError<403, types.RollbackDeployResponse403> You do not have permissions for the requested resource.
     * @throws FetchError<404, types.RollbackDeployResponse404> Unable to find the requested resource.
     * @throws FetchError<429, types.RollbackDeployResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.RollbackDeployResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.RollbackDeployResponse503> Server currently unavailable.
     */
    rollbackDeploy(body: types.RollbackDeployBodyParam, metadata: types.RollbackDeployMetadataParam): Promise<FetchResponse<201, types.RollbackDeployResponse201>>;
    /**
     * List all environment variables for the service with the provided ID.
     *
     * @summary List environment variables
     * @throws FetchError<401, types.GetEnvVarsForServiceResponse401> Authorization information is missing or invalid.
     * @throws FetchError<403, types.GetEnvVarsForServiceResponse403> You do not have permissions for the requested resource.
     * @throws FetchError<404, types.GetEnvVarsForServiceResponse404> Unable to find the requested resource.
     * @throws FetchError<406, types.GetEnvVarsForServiceResponse406> Unable to generate preferred media types as specified by Accept request header.
     * @throws FetchError<410, types.GetEnvVarsForServiceResponse410> The requested resource is no longer available.
     * @throws FetchError<429, types.GetEnvVarsForServiceResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.GetEnvVarsForServiceResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.GetEnvVarsForServiceResponse503> Server currently unavailable.
     */
    getEnvVarsForService(metadata: types.GetEnvVarsForServiceMetadataParam): Promise<FetchResponse<200, types.GetEnvVarsForServiceResponse200>>;
    /**
     * Replace all environment variables for a service with the provided list of environment
     * variables.
     *
     * @summary Update environment variables
     * @throws FetchError<400, types.UpdateEnvVarsForServiceResponse400> The request could not be understood by the server.
     * @throws FetchError<401, types.UpdateEnvVarsForServiceResponse401> Authorization information is missing or invalid.
     * @throws FetchError<403, types.UpdateEnvVarsForServiceResponse403> You do not have permissions for the requested resource.
     * @throws FetchError<404, types.UpdateEnvVarsForServiceResponse404> Unable to find the requested resource.
     * @throws FetchError<406, types.UpdateEnvVarsForServiceResponse406> Unable to generate preferred media types as specified by Accept request header.
     * @throws FetchError<410, types.UpdateEnvVarsForServiceResponse410> The requested resource is no longer available.
     * @throws FetchError<429, types.UpdateEnvVarsForServiceResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.UpdateEnvVarsForServiceResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.UpdateEnvVarsForServiceResponse503> Server currently unavailable.
     */
    updateEnvVarsForService(body: types.UpdateEnvVarsForServiceBodyParam, metadata: types.UpdateEnvVarsForServiceMetadataParam): Promise<FetchResponse<200, types.UpdateEnvVarsForServiceResponse200>>;
    /**
     * Retrieve a particular environment variable for a particular service.
     *
     * This only applies to environment variables set directly on the service, not to
     * environment variables in a linked environment group.
     *
     * @summary Retrieve environment variable
     * @throws FetchError<401, types.RetrieveEnvVarResponse401> Authorization information is missing or invalid.
     * @throws FetchError<403, types.RetrieveEnvVarResponse403> You do not have permissions for the requested resource.
     * @throws FetchError<404, types.RetrieveEnvVarResponse404> Unable to find the requested resource.
     * @throws FetchError<406, types.RetrieveEnvVarResponse406> Unable to generate preferred media types as specified by Accept request header.
     * @throws FetchError<410, types.RetrieveEnvVarResponse410> The requested resource is no longer available.
     * @throws FetchError<429, types.RetrieveEnvVarResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.RetrieveEnvVarResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.RetrieveEnvVarResponse503> Server currently unavailable.
     */
    retrieveEnvVar(metadata: types.RetrieveEnvVarMetadataParam): Promise<FetchResponse<200, types.RetrieveEnvVarResponse200>>;
    /**
     * Add or update a particular environment variable for a particular service.
     *
     * This only applies to environment variables set directly on the service, not to
     * environment variables in a linked environment group.
     *
     * @summary Add or update environment variable
     * @throws FetchError<400, types.UpdateEnvVarResponse400> The request could not be understood by the server.
     * @throws FetchError<401, types.UpdateEnvVarResponse401> Authorization information is missing or invalid.
     * @throws FetchError<403, types.UpdateEnvVarResponse403> You do not have permissions for the requested resource.
     * @throws FetchError<404, types.UpdateEnvVarResponse404> Unable to find the requested resource.
     * @throws FetchError<406, types.UpdateEnvVarResponse406> Unable to generate preferred media types as specified by Accept request header.
     * @throws FetchError<410, types.UpdateEnvVarResponse410> The requested resource is no longer available.
     * @throws FetchError<429, types.UpdateEnvVarResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.UpdateEnvVarResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.UpdateEnvVarResponse503> Server currently unavailable.
     */
    updateEnvVar(body: types.UpdateEnvVarBodyParam, metadata: types.UpdateEnvVarMetadataParam): Promise<FetchResponse<200, types.UpdateEnvVarResponse200>>;
    /**
     * Delete a particular environment variable from a particular service.
     *
     * This only applies to environment variables set directly on the service, not to
     * environment variables in a linked environment group.
     *
     * @summary Delete environment variable
     * @throws FetchError<401, types.DeleteEnvVarResponse401> Authorization information is missing or invalid.
     * @throws FetchError<403, types.DeleteEnvVarResponse403> You do not have permissions for the requested resource.
     * @throws FetchError<404, types.DeleteEnvVarResponse404> Unable to find the requested resource.
     * @throws FetchError<406, types.DeleteEnvVarResponse406> Unable to generate preferred media types as specified by Accept request header.
     * @throws FetchError<410, types.DeleteEnvVarResponse410> The requested resource is no longer available.
     * @throws FetchError<429, types.DeleteEnvVarResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.DeleteEnvVarResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.DeleteEnvVarResponse503> Server currently unavailable.
     */
    deleteEnvVar(metadata: types.DeleteEnvVarMetadataParam): Promise<FetchResponse<number, unknown>>;
    /**
     * List all secret files for the service with the provided ID.
     *
     * @summary List secret files
     * @throws FetchError<401, types.ListSecretFilesForServiceResponse401> Authorization information is missing or invalid.
     * @throws FetchError<403, types.ListSecretFilesForServiceResponse403> You do not have permissions for the requested resource.
     * @throws FetchError<404, types.ListSecretFilesForServiceResponse404> Unable to find the requested resource.
     * @throws FetchError<406, types.ListSecretFilesForServiceResponse406> Unable to generate preferred media types as specified by Accept request header.
     * @throws FetchError<410, types.ListSecretFilesForServiceResponse410> The requested resource is no longer available.
     * @throws FetchError<429, types.ListSecretFilesForServiceResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.ListSecretFilesForServiceResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.ListSecretFilesForServiceResponse503> Server currently unavailable.
     */
    listSecretFilesForService(metadata: types.ListSecretFilesForServiceMetadataParam): Promise<FetchResponse<200, types.ListSecretFilesForServiceResponse200>>;
    /**
     * Replace all secret files for a service with the provided list of secret files.
     *
     * **Any of the service's existing secret files not included in this request will be
     * deleted.**
     *
     * This only applies to secret files set directly on the service, not to secret files in a
     * linked environment group.
     *
     * @summary Update secret files
     * @throws FetchError<400, types.UpdateSecretFilesForServiceResponse400> The request could not be understood by the server.
     * @throws FetchError<401, types.UpdateSecretFilesForServiceResponse401> Authorization information is missing or invalid.
     * @throws FetchError<403, types.UpdateSecretFilesForServiceResponse403> You do not have permissions for the requested resource.
     * @throws FetchError<404, types.UpdateSecretFilesForServiceResponse404> Unable to find the requested resource.
     * @throws FetchError<406, types.UpdateSecretFilesForServiceResponse406> Unable to generate preferred media types as specified by Accept request header.
     * @throws FetchError<410, types.UpdateSecretFilesForServiceResponse410> The requested resource is no longer available.
     * @throws FetchError<429, types.UpdateSecretFilesForServiceResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.UpdateSecretFilesForServiceResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.UpdateSecretFilesForServiceResponse503> Server currently unavailable.
     */
    updateSecretFilesForService(body: types.UpdateSecretFilesForServiceBodyParam, metadata: types.UpdateSecretFilesForServiceMetadataParam): Promise<FetchResponse<200, types.UpdateSecretFilesForServiceResponse200>>;
    /**
     * Retrieve a particular secret file for a particular service.
     *
     * This only applies to secret files set directly on the service, not to secret files in a
     * linked environment group.
     *
     * @summary Retrieve secret file
     * @throws FetchError<401, types.RetrieveSecretFileResponse401> Authorization information is missing or invalid.
     * @throws FetchError<403, types.RetrieveSecretFileResponse403> You do not have permissions for the requested resource.
     * @throws FetchError<404, types.RetrieveSecretFileResponse404> Unable to find the requested resource.
     * @throws FetchError<406, types.RetrieveSecretFileResponse406> Unable to generate preferred media types as specified by Accept request header.
     * @throws FetchError<410, types.RetrieveSecretFileResponse410> The requested resource is no longer available.
     * @throws FetchError<429, types.RetrieveSecretFileResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.RetrieveSecretFileResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.RetrieveSecretFileResponse503> Server currently unavailable.
     */
    retrieveSecretFile(metadata: types.RetrieveSecretFileMetadataParam): Promise<FetchResponse<200, types.RetrieveSecretFileResponse200>>;
    /**
     * Add or update a particular secret file for a particular service.
     *
     * This only applies to secret files set directly on the service, not to secret files in a
     * linked environment group.
     *
     * @summary Add or update secret file
     * @throws FetchError<400, types.AddOrUpdateSecretFileResponse400> The request could not be understood by the server.
     * @throws FetchError<401, types.AddOrUpdateSecretFileResponse401> Authorization information is missing or invalid.
     * @throws FetchError<403, types.AddOrUpdateSecretFileResponse403> You do not have permissions for the requested resource.
     * @throws FetchError<404, types.AddOrUpdateSecretFileResponse404> Unable to find the requested resource.
     * @throws FetchError<406, types.AddOrUpdateSecretFileResponse406> Unable to generate preferred media types as specified by Accept request header.
     * @throws FetchError<410, types.AddOrUpdateSecretFileResponse410> The requested resource is no longer available.
     * @throws FetchError<429, types.AddOrUpdateSecretFileResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.AddOrUpdateSecretFileResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.AddOrUpdateSecretFileResponse503> Server currently unavailable.
     */
    addOrUpdateSecretFile(body: types.AddOrUpdateSecretFileBodyParam, metadata: types.AddOrUpdateSecretFileMetadataParam): Promise<FetchResponse<201, types.AddOrUpdateSecretFileResponse201>>;
    /**
     * Delete a particular secret file from a particular service.
     *
     * This only applies to secret files set directly on the service, not to secret files in a
     * linked environment group.
     *
     * @summary Delete secret file
     * @throws FetchError<401, types.DeleteSecretFileResponse401> Authorization information is missing or invalid.
     * @throws FetchError<403, types.DeleteSecretFileResponse403> You do not have permissions for the requested resource.
     * @throws FetchError<404, types.DeleteSecretFileResponse404> Unable to find the requested resource.
     * @throws FetchError<406, types.DeleteSecretFileResponse406> Unable to generate preferred media types as specified by Accept request header.
     * @throws FetchError<410, types.DeleteSecretFileResponse410> The requested resource is no longer available.
     * @throws FetchError<429, types.DeleteSecretFileResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.DeleteSecretFileResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.DeleteSecretFileResponse503> Server currently unavailable.
     */
    deleteSecretFile(metadata: types.DeleteSecretFileMetadataParam): Promise<FetchResponse<number, unknown>>;
    /**
     * List recent events that occurred for the service with the provided ID.
     *
     * @summary List events
     * @throws FetchError<400, types.ListEventsResponse400> The request could not be understood by the server.
     * @throws FetchError<401, types.ListEventsResponse401> Authorization information is missing or invalid.
     * @throws FetchError<404, types.ListEventsResponse404> Unable to find the requested resource.
     * @throws FetchError<429, types.ListEventsResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.ListEventsResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.ListEventsResponse503> Server currently unavailable.
     */
    listEvents(metadata: types.ListEventsMetadataParam): Promise<FetchResponse<200, types.ListEventsResponse200>>;
    /**
     * List a particular service's response header rules that match the provided filters. If no
     * filters are provided, all rules for the service are returned.
     *
     * @summary List header rules
     * @throws FetchError<401, types.ListHeadersResponse401> Authorization information is missing or invalid.
     * @throws FetchError<403, types.ListHeadersResponse403> You do not have permissions for the requested resource.
     * @throws FetchError<404, types.ListHeadersResponse404> Unable to find the requested resource.
     * @throws FetchError<406, types.ListHeadersResponse406> Unable to generate preferred media types as specified by Accept request header.
     * @throws FetchError<410, types.ListHeadersResponse410> The requested resource is no longer available.
     * @throws FetchError<429, types.ListHeadersResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.ListHeadersResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.ListHeadersResponse503> Server currently unavailable.
     */
    listHeaders(metadata: types.ListHeadersMetadataParam): Promise<FetchResponse<200, types.ListHeadersResponse200>>;
    /**
     * Add a response header rule to the service with the provided ID.
     *
     * @summary Add header rule
     * @throws FetchError<401, types.AddHeadersResponse401> Authorization information is missing or invalid.
     * @throws FetchError<403, types.AddHeadersResponse403> You do not have permissions for the requested resource.
     * @throws FetchError<404, types.AddHeadersResponse404> Unable to find the requested resource.
     * @throws FetchError<406, types.AddHeadersResponse406> Unable to generate preferred media types as specified by Accept request header.
     * @throws FetchError<410, types.AddHeadersResponse410> The requested resource is no longer available.
     * @throws FetchError<429, types.AddHeadersResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.AddHeadersResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.AddHeadersResponse503> Server currently unavailable.
     */
    addHeaders(body: types.AddHeadersBodyParam, metadata: types.AddHeadersMetadataParam): Promise<FetchResponse<201, types.AddHeadersResponse201>>;
    /**
     * Replace all header rules for a particular service with the provided list.
     *
     * **This deletes all existing header rules for the service that aren't included in the
     * request.**
     *
     * @summary Replace header rules
     * @throws FetchError<400, types.UpdateHeadersResponse400> The request could not be understood by the server.
     * @throws FetchError<401, types.UpdateHeadersResponse401> Authorization information is missing or invalid.
     * @throws FetchError<403, types.UpdateHeadersResponse403> You do not have permissions for the requested resource.
     * @throws FetchError<404, types.UpdateHeadersResponse404> Unable to find the requested resource.
     * @throws FetchError<406, types.UpdateHeadersResponse406> Unable to generate preferred media types as specified by Accept request header.
     * @throws FetchError<410, types.UpdateHeadersResponse410> The requested resource is no longer available.
     * @throws FetchError<429, types.UpdateHeadersResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.UpdateHeadersResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.UpdateHeadersResponse503> Server currently unavailable.
     */
    updateHeaders(body: types.UpdateHeadersBodyParam, metadata: types.UpdateHeadersMetadataParam): Promise<FetchResponse<200, types.UpdateHeadersResponse200>>;
    /**
     * Delete a particular response header rule for a particular service.
     *
     * @summary Delete header rule
     * @throws FetchError<401, types.DeleteHeaderResponse401> Authorization information is missing or invalid.
     * @throws FetchError<403, types.DeleteHeaderResponse403> You do not have permissions for the requested resource.
     * @throws FetchError<404, types.DeleteHeaderResponse404> Unable to find the requested resource.
     * @throws FetchError<406, types.DeleteHeaderResponse406> Unable to generate preferred media types as specified by Accept request header.
     * @throws FetchError<410, types.DeleteHeaderResponse410> The requested resource is no longer available.
     * @throws FetchError<429, types.DeleteHeaderResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.DeleteHeaderResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.DeleteHeaderResponse503> Server currently unavailable.
     */
    deleteHeader(metadata: types.DeleteHeaderMetadataParam): Promise<FetchResponse<number, unknown>>;
    /**
     * List a particular service's redirect/rewrite rules that match the provided filters. If
     * no filters are provided, all rules for the service are returned.
     *
     * @summary List redirect/rewrite rules
     * @throws FetchError<401, types.ListRoutesResponse401> Authorization information is missing or invalid.
     * @throws FetchError<403, types.ListRoutesResponse403> You do not have permissions for the requested resource.
     * @throws FetchError<404, types.ListRoutesResponse404> Unable to find the requested resource.
     * @throws FetchError<406, types.ListRoutesResponse406> Unable to generate preferred media types as specified by Accept request header.
     * @throws FetchError<410, types.ListRoutesResponse410> The requested resource is no longer available.
     * @throws FetchError<429, types.ListRoutesResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.ListRoutesResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.ListRoutesResponse503> Server currently unavailable.
     */
    listRoutes(metadata: types.ListRoutesMetadataParam): Promise<FetchResponse<200, types.ListRoutesResponse200>>;
    /**
     * Add redirect/rewrite rules to the service with the provided ID.
     *
     * @summary Add redirect/rewrite rules
     * @throws FetchError<400, types.AddRouteResponse400> The request could not be understood by the server.
     * @throws FetchError<401, types.AddRouteResponse401> Authorization information is missing or invalid.
     * @throws FetchError<403, types.AddRouteResponse403> You do not have permissions for the requested resource.
     * @throws FetchError<404, types.AddRouteResponse404> Unable to find the requested resource.
     * @throws FetchError<406, types.AddRouteResponse406> Unable to generate preferred media types as specified by Accept request header.
     * @throws FetchError<410, types.AddRouteResponse410> The requested resource is no longer available.
     * @throws FetchError<429, types.AddRouteResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.AddRouteResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.AddRouteResponse503> Server currently unavailable.
     */
    addRoute(body: types.AddRouteBodyParam, metadata: types.AddRouteMetadataParam): Promise<FetchResponse<201, types.AddRouteResponse201>>;
    /**
     * Update the priority for a particular redirect/rewrite rule.
     *
     * To apply redirect/rewrite rules to an incoming request, Render starts from the rule with
     * priority `0` and applies the first encountered rule that matches the request's path (if
     * any).
     *
     * Render increments the priority of other rules by `1` as necessary to make space for the
     * updated rule.
     *
     * @summary Update redirect/rewrite rule priority
     * @throws FetchError<401, types.PatchRouteResponse401> Authorization information is missing or invalid.
     * @throws FetchError<403, types.PatchRouteResponse403> You do not have permissions for the requested resource.
     * @throws FetchError<404, types.PatchRouteResponse404> Unable to find the requested resource.
     * @throws FetchError<406, types.PatchRouteResponse406> Unable to generate preferred media types as specified by Accept request header.
     * @throws FetchError<410, types.PatchRouteResponse410> The requested resource is no longer available.
     * @throws FetchError<429, types.PatchRouteResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.PatchRouteResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.PatchRouteResponse503> Server currently unavailable.
     */
    patchRoute(body: types.PatchRouteBodyParam, metadata: types.PatchRouteMetadataParam): Promise<FetchResponse<200, types.PatchRouteResponse200>>;
    /**
     * Replace all redirect/rewrite rules for a particular service with the provided list.
     *
     * **This deletes all existing redirect/rewrite rules for the service that aren't included
     * in the request.**
     *
     * Rule priority is assigned according to list order (the first rule in the list has the
     * highest priority).
     *
     * @summary Update redirect/rewrite rules
     * @throws FetchError<400, types.PutRoutesResponse400> The request could not be understood by the server.
     * @throws FetchError<401, types.PutRoutesResponse401> Authorization information is missing or invalid.
     * @throws FetchError<403, types.PutRoutesResponse403> You do not have permissions for the requested resource.
     * @throws FetchError<404, types.PutRoutesResponse404> Unable to find the requested resource.
     * @throws FetchError<406, types.PutRoutesResponse406> Unable to generate preferred media types as specified by Accept request header.
     * @throws FetchError<410, types.PutRoutesResponse410> The requested resource is no longer available.
     * @throws FetchError<429, types.PutRoutesResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.PutRoutesResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.PutRoutesResponse503> Server currently unavailable.
     */
    putRoutes(body: types.PutRoutesBodyParam, metadata: types.PutRoutesMetadataParam): Promise<FetchResponse<200, types.PutRoutesResponse200>>;
    /**
     * Delete a particular redirect/rewrite rule for a particular service.
     *
     * @summary Delete redirect/rewrite rule
     * @throws FetchError<401, types.DeleteRouteResponse401> Authorization information is missing or invalid.
     * @throws FetchError<403, types.DeleteRouteResponse403> You do not have permissions for the requested resource.
     * @throws FetchError<404, types.DeleteRouteResponse404> Unable to find the requested resource.
     * @throws FetchError<406, types.DeleteRouteResponse406> Unable to generate preferred media types as specified by Accept request header.
     * @throws FetchError<410, types.DeleteRouteResponse410> The requested resource is no longer available.
     * @throws FetchError<429, types.DeleteRouteResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.DeleteRouteResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.DeleteRouteResponse503> Server currently unavailable.
     */
    deleteRoute(metadata: types.DeleteRouteMetadataParam): Promise<FetchResponse<number, unknown>>;
    /**
     * List a particular service's custom domains that match the provided filters. If no
     * filters are provided, all custom domains for the service are returned.
     *
     * @summary List custom domains
     * @throws FetchError<400, types.ListCustomDomainsResponse400> The request could not be understood by the server.
     * @throws FetchError<401, types.ListCustomDomainsResponse401> Authorization information is missing or invalid.
     * @throws FetchError<403, types.ListCustomDomainsResponse403> You do not have permissions for the requested resource.
     * @throws FetchError<404, types.ListCustomDomainsResponse404> Unable to find the requested resource.
     * @throws FetchError<406, types.ListCustomDomainsResponse406> Unable to generate preferred media types as specified by Accept request header.
     * @throws FetchError<410, types.ListCustomDomainsResponse410> The requested resource is no longer available.
     * @throws FetchError<429, types.ListCustomDomainsResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.ListCustomDomainsResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.ListCustomDomainsResponse503> Server currently unavailable.
     */
    listCustomDomains(metadata: types.ListCustomDomainsMetadataParam): Promise<FetchResponse<200, types.ListCustomDomainsResponse200>>;
    /**
     * Add a custom domain to the service with the provided ID.
     *
     * @summary Add custom domain
     * @throws FetchError<400, types.CreateCustomDomainResponse400> The request could not be understood by the server.
     * @throws FetchError<401, types.CreateCustomDomainResponse401> Authorization information is missing or invalid.
     * @throws FetchError<402, types.CreateCustomDomainResponse402> You must enter payment information to perform this request.
     * @throws FetchError<403, types.CreateCustomDomainResponse403> You do not have permissions for the requested resource.
     * @throws FetchError<404, types.CreateCustomDomainResponse404> Unable to find the requested resource.
     * @throws FetchError<406, types.CreateCustomDomainResponse406> Unable to generate preferred media types as specified by Accept request header.
     * @throws FetchError<409, types.CreateCustomDomainResponse409> The current state of the resource conflicts with this request.
     * @throws FetchError<410, types.CreateCustomDomainResponse410> The requested resource is no longer available.
     * @throws FetchError<429, types.CreateCustomDomainResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.CreateCustomDomainResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.CreateCustomDomainResponse503> Server currently unavailable.
     */
    createCustomDomain(body: types.CreateCustomDomainBodyParam, metadata: types.CreateCustomDomainMetadataParam): Promise<FetchResponse<201, types.CreateCustomDomainResponse201>>;
    /**
     * Retrieve a particular custom domain for a particular service.
     *
     * @summary Retrieve custom domain
     * @throws FetchError<400, types.RetrieveCustomDomainResponse400> The request could not be understood by the server.
     * @throws FetchError<401, types.RetrieveCustomDomainResponse401> Authorization information is missing or invalid.
     * @throws FetchError<403, types.RetrieveCustomDomainResponse403> You do not have permissions for the requested resource.
     * @throws FetchError<404, types.RetrieveCustomDomainResponse404> Unable to find the requested resource.
     * @throws FetchError<406, types.RetrieveCustomDomainResponse406> Unable to generate preferred media types as specified by Accept request header.
     * @throws FetchError<410, types.RetrieveCustomDomainResponse410> The requested resource is no longer available.
     * @throws FetchError<429, types.RetrieveCustomDomainResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.RetrieveCustomDomainResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.RetrieveCustomDomainResponse503> Server currently unavailable.
     */
    retrieveCustomDomain(metadata: types.RetrieveCustomDomainMetadataParam): Promise<FetchResponse<200, types.RetrieveCustomDomainResponse200>>;
    /**
     * Delete a custom domain for a service given the service id and custom domain id or name.
     *
     * @summary Delete custom domain
     * @throws FetchError<400, types.DeleteCustomDomainResponse400> The request could not be understood by the server.
     * @throws FetchError<401, types.DeleteCustomDomainResponse401> Authorization information is missing or invalid.
     * @throws FetchError<403, types.DeleteCustomDomainResponse403> You do not have permissions for the requested resource.
     * @throws FetchError<404, types.DeleteCustomDomainResponse404> Unable to find the requested resource.
     * @throws FetchError<406, types.DeleteCustomDomainResponse406> Unable to generate preferred media types as specified by Accept request header.
     * @throws FetchError<410, types.DeleteCustomDomainResponse410> The requested resource is no longer available.
     * @throws FetchError<429, types.DeleteCustomDomainResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.DeleteCustomDomainResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.DeleteCustomDomainResponse503> Server currently unavailable.
     */
    deleteCustomDomain(metadata: types.DeleteCustomDomainMetadataParam): Promise<FetchResponse<number, unknown>>;
    /**
     * Verify the DNS configuration for a custom domain.
     *
     * @summary Verify DNS configuration
     * @throws FetchError<400, types.RefreshCustomDomainResponse400> The request could not be understood by the server.
     * @throws FetchError<401, types.RefreshCustomDomainResponse401> Authorization information is missing or invalid.
     * @throws FetchError<403, types.RefreshCustomDomainResponse403> You do not have permissions for the requested resource.
     * @throws FetchError<404, types.RefreshCustomDomainResponse404> Unable to find the requested resource.
     * @throws FetchError<406, types.RefreshCustomDomainResponse406> Unable to generate preferred media types as specified by Accept request header.
     * @throws FetchError<410, types.RefreshCustomDomainResponse410> The requested resource is no longer available.
     * @throws FetchError<429, types.RefreshCustomDomainResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.RefreshCustomDomainResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.RefreshCustomDomainResponse503> Server currently unavailable.
     */
    refreshCustomDomain(metadata: types.RefreshCustomDomainMetadataParam): Promise<FetchResponse<number, unknown>>;
    /**
     * Suspend the service with the provided ID.
     *
     * @summary Suspend service
     * @throws FetchError<400, types.SuspendServiceResponse400> The request could not be understood by the server.
     * @throws FetchError<401, types.SuspendServiceResponse401> Authorization information is missing or invalid.
     * @throws FetchError<403, types.SuspendServiceResponse403> You do not have permissions for the requested resource.
     * @throws FetchError<404, types.SuspendServiceResponse404> Unable to find the requested resource.
     * @throws FetchError<406, types.SuspendServiceResponse406> Unable to generate preferred media types as specified by Accept request header.
     * @throws FetchError<410, types.SuspendServiceResponse410> The requested resource is no longer available.
     * @throws FetchError<429, types.SuspendServiceResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.SuspendServiceResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.SuspendServiceResponse503> Server currently unavailable.
     */
    suspendService(metadata: types.SuspendServiceMetadataParam): Promise<FetchResponse<number, unknown>>;
    /**
     * Resume the service with the provided ID (if it's currently suspended).
     *
     * @summary Resume service
     * @throws FetchError<400, types.ResumeServiceResponse400> The request could not be understood by the server.
     * @throws FetchError<401, types.ResumeServiceResponse401> Authorization information is missing or invalid.
     * @throws FetchError<403, types.ResumeServiceResponse403> You do not have permissions for the requested resource.
     * @throws FetchError<404, types.ResumeServiceResponse404> Unable to find the requested resource.
     * @throws FetchError<406, types.ResumeServiceResponse406> Unable to generate preferred media types as specified by Accept request header.
     * @throws FetchError<410, types.ResumeServiceResponse410> The requested resource is no longer available.
     * @throws FetchError<429, types.ResumeServiceResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.ResumeServiceResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.ResumeServiceResponse503> Server currently unavailable.
     */
    resumeService(metadata: types.ResumeServiceMetadataParam): Promise<FetchResponse<number, unknown>>;
    /**
     * Restart the service with the provided ID.
     *
     * Not supported for cron jobs.
     *
     * @summary Restart service
     * @throws FetchError<400, types.RestartServiceResponse400> The request could not be understood by the server.
     * @throws FetchError<401, types.RestartServiceResponse401> Authorization information is missing or invalid.
     * @throws FetchError<403, types.RestartServiceResponse403> You do not have permissions for the requested resource.
     * @throws FetchError<404, types.RestartServiceResponse404> Unable to find the requested resource.
     * @throws FetchError<406, types.RestartServiceResponse406> Unable to generate preferred media types as specified by Accept request header.
     * @throws FetchError<410, types.RestartServiceResponse410> The requested resource is no longer available.
     * @throws FetchError<429, types.RestartServiceResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.RestartServiceResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.RestartServiceResponse503> Server currently unavailable.
     */
    restartService(metadata: types.RestartServiceMetadataParam): Promise<FetchResponse<number, unknown>>;
    /**
     * [Scale](https://docs.render.com/scaling#manual-scaling) the service with the provided ID
     * to a fixed number of instances.
     *
     * Render ignores this value as long as autoscaling is enabled for the service.
     *
     * @summary Scale instance count
     * @throws FetchError<400, types.ScaleServiceResponse400> The request could not be understood by the server.
     * @throws FetchError<401, types.ScaleServiceResponse401> Authorization information is missing or invalid.
     * @throws FetchError<403, types.ScaleServiceResponse403> You do not have permissions for the requested resource.
     * @throws FetchError<404, types.ScaleServiceResponse404> Unable to find the requested resource.
     * @throws FetchError<406, types.ScaleServiceResponse406> Unable to generate preferred media types as specified by Accept request header.
     * @throws FetchError<410, types.ScaleServiceResponse410> The requested resource is no longer available.
     * @throws FetchError<429, types.ScaleServiceResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.ScaleServiceResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.ScaleServiceResponse503> Server currently unavailable.
     */
    scaleService(body: types.ScaleServiceBodyParam, metadata: types.ScaleServiceMetadataParam): Promise<FetchResponse<number, unknown>>;
    /**
     * Update the [autoscaling](https://docs.render.com/scaling#autoscaling) config for the
     * service with the provided ID.
     *
     * @summary Update autoscaling config
     * @throws FetchError<400, types.AutoscaleServiceResponse400> The request could not be understood by the server.
     * @throws FetchError<401, types.AutoscaleServiceResponse401> Authorization information is missing or invalid.
     * @throws FetchError<403, types.AutoscaleServiceResponse403> You do not have permissions for the requested resource.
     * @throws FetchError<404, types.AutoscaleServiceResponse404> Unable to find the requested resource.
     * @throws FetchError<406, types.AutoscaleServiceResponse406> Unable to generate preferred media types as specified by Accept request header.
     * @throws FetchError<410, types.AutoscaleServiceResponse410> The requested resource is no longer available.
     * @throws FetchError<429, types.AutoscaleServiceResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.AutoscaleServiceResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.AutoscaleServiceResponse503> Server currently unavailable.
     */
    autoscaleService(body: types.AutoscaleServiceBodyParam, metadata: types.AutoscaleServiceMetadataParam): Promise<FetchResponse<200, types.AutoscaleServiceResponse200>>;
    /**
     * Delete the autoscaling config for a service given the service id.
     *
     * @summary Delete autoscaling config
     * @throws FetchError<401, types.DeleteAutoscalingConfigResponse401> Authorization information is missing or invalid.
     * @throws FetchError<403, types.DeleteAutoscalingConfigResponse403> You do not have permissions for the requested resource.
     * @throws FetchError<404, types.DeleteAutoscalingConfigResponse404> Unable to find the requested resource.
     * @throws FetchError<406, types.DeleteAutoscalingConfigResponse406> Unable to generate preferred media types as specified by Accept request header.
     * @throws FetchError<410, types.DeleteAutoscalingConfigResponse410> The requested resource is no longer available.
     * @throws FetchError<429, types.DeleteAutoscalingConfigResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.DeleteAutoscalingConfigResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.DeleteAutoscalingConfigResponse503> Server currently unavailable.
     */
    deleteAutoscalingConfig(metadata: types.DeleteAutoscalingConfigMetadataParam): Promise<FetchResponse<number, unknown>>;
    /**
     * Create a preview instance for an image-backed service. The preview uses the settings of
     * the base service (referenced by `serviceId`), except settings overridden via provided
     * parameters.
     *
     * View all active previews from your service's Previews tab in the Render Dashboard.
     *
     * Note that you can't create previews for Git-backed services using the Render API.
     *
     * @summary Create service preview (image-backed)
     * @throws FetchError<400, types.PreviewServiceResponse400> The request could not be understood by the server.
     * @throws FetchError<401, types.PreviewServiceResponse401> Authorization information is missing or invalid.
     * @throws FetchError<403, types.PreviewServiceResponse403> You do not have permissions for the requested resource.
     * @throws FetchError<404, types.PreviewServiceResponse404> Unable to find the requested resource.
     * @throws FetchError<429, types.PreviewServiceResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.PreviewServiceResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.PreviewServiceResponse503> Server currently unavailable.
     */
    previewService(body: types.PreviewServiceBodyParam, metadata: types.PreviewServiceMetadataParam): Promise<FetchResponse<200, types.PreviewServiceResponse200>>;
    /**
     * List jobs for the provided service that match the provided filters. If no filters are
     * provided, all jobs for the service are returned.
     *
     * @summary List jobs
     * @throws FetchError<400, types.ListJobResponse400> The request could not be understood by the server.
     * @throws FetchError<401, types.ListJobResponse401> Authorization information is missing or invalid.
     * @throws FetchError<404, types.ListJobResponse404> Unable to find the requested resource.
     * @throws FetchError<429, types.ListJobResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.ListJobResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.ListJobResponse503> Server currently unavailable.
     */
    listJob(metadata: types.ListJobMetadataParam): Promise<FetchResponse<200, types.ListJobResponse200>>;
    /**
     * Create a one-off job using the provided service. For details, see [One-Off
     * Jobs](https://docs.render.com/jobs).
     *
     * @summary Create job
     * @throws FetchError<400, types.PostJobResponse400> The request could not be understood by the server.
     * @throws FetchError<401, types.PostJobResponse401> Authorization information is missing or invalid.
     * @throws FetchError<404, types.PostJobResponse404> Unable to find the requested resource.
     * @throws FetchError<429, types.PostJobResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.PostJobResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.PostJobResponse503> Server currently unavailable.
     */
    postJob(body: types.PostJobBodyParam, metadata: types.PostJobMetadataParam): Promise<FetchResponse<201, types.PostJobResponse201>>;
    /**
     * Retrieve the details of a particular one-off job for a particular service.
     *
     * @summary Retrieve job
     * @throws FetchError<400, types.RetrieveJobResponse400> The request could not be understood by the server.
     * @throws FetchError<401, types.RetrieveJobResponse401> Authorization information is missing or invalid.
     * @throws FetchError<404, types.RetrieveJobResponse404> Unable to find the requested resource.
     * @throws FetchError<429, types.RetrieveJobResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.RetrieveJobResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.RetrieveJobResponse503> Server currently unavailable.
     */
    retrieveJob(metadata: types.RetrieveJobMetadataParam): Promise<FetchResponse<200, types.RetrieveJobResponse200>>;
    /**
     * Cancel a particular one-off job for a particular service.
     *
     * @summary Cancel running job
     * @throws FetchError<400, types.CancelJobResponse400> The request could not be understood by the server.
     * @throws FetchError<401, types.CancelJobResponse401> Authorization information is missing or invalid.
     * @throws FetchError<404, types.CancelJobResponse404> Unable to find the requested resource.
     * @throws FetchError<429, types.CancelJobResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.CancelJobResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.CancelJobResponse503> Server currently unavailable.
     */
    cancelJob(metadata: types.CancelJobMetadataParam): Promise<FetchResponse<200, types.CancelJobResponse200>>;
    /**
     * Trigger a run for a cron job and cancel any active runs.
     *
     * @summary Trigger cron job run
     * @throws FetchError<401, types.RunCronJobResponse401> Authorization information is missing or invalid.
     * @throws FetchError<406, types.RunCronJobResponse406> Unable to generate preferred media types as specified by Accept request header.
     * @throws FetchError<429, types.RunCronJobResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.RunCronJobResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.RunCronJobResponse503> Server currently unavailable.
     */
    runCronJob(metadata: types.RunCronJobMetadataParam): Promise<FetchResponse<200, types.RunCronJobResponse200>>;
    /**
     * Cancel a currently running cron job.
     *
     * @summary Cancel running cron job
     * @throws FetchError<401, types.CancelCronJobRunResponse401> Authorization information is missing or invalid.
     * @throws FetchError<406, types.CancelCronJobRunResponse406> Unable to generate preferred media types as specified by Accept request header.
     * @throws FetchError<429, types.CancelCronJobRunResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.CancelCronJobRunResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.CancelCronJobRunResponse503> Server currently unavailable.
     */
    cancelCronJobRun(metadata: types.CancelCronJobRunMetadataParam): Promise<FetchResponse<number, unknown>>;
    /**
     * Retrieve the details of a particular event
     *
     * @summary Retrieve event
     * @throws FetchError<400, types.RetrieveEventResponse400> The request could not be understood by the server.
     * @throws FetchError<401, types.RetrieveEventResponse401> Authorization information is missing or invalid.
     * @throws FetchError<403, types.RetrieveEventResponse403> You do not have permissions for the requested resource.
     * @throws FetchError<404, types.RetrieveEventResponse404> Unable to find the requested resource.
     * @throws FetchError<406, types.RetrieveEventResponse406> Unable to generate preferred media types as specified by Accept request header.
     * @throws FetchError<410, types.RetrieveEventResponse410> The requested resource is no longer available.
     * @throws FetchError<429, types.RetrieveEventResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.RetrieveEventResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.RetrieveEventResponse503> Server currently unavailable.
     */
    retrieveEvent(metadata: types.RetrieveEventMetadataParam): Promise<FetchResponse<200, types.RetrieveEventResponse200>>;
    /**
     * List logs matching the provided filters. Logs are paginated by start and end timestamps.
     * There are more logs to fetch if `hasMore` is true in the response. Provide the
     * `nextStartTime`
     * and `nextEndTime` timestamps as the `startTime` and `endTime` query parameters to fetch
     * the next page of logs.
     *
     * You can query for logs across multiple resources, but all resources must be in the same
     * region and belong to the same owner.
     *
     * @summary List logs
     * @throws FetchError<400, types.ListLogsResponse400> The request could not be understood by the server.
     * @throws FetchError<401, types.ListLogsResponse401> Authorization information is missing or invalid.
     * @throws FetchError<403, types.ListLogsResponse403> You do not have permissions for the requested resource.
     * @throws FetchError<404, types.ListLogsResponse404> Unable to find the requested resource.
     * @throws FetchError<406, types.ListLogsResponse406> Unable to generate preferred media types as specified by Accept request header.
     * @throws FetchError<410, types.ListLogsResponse410> The requested resource is no longer available.
     * @throws FetchError<429, types.ListLogsResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.ListLogsResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.ListLogsResponse503> Server currently unavailable.
     */
    listLogs(metadata: types.ListLogsMetadataParam): Promise<FetchResponse<200, types.ListLogsResponse200>>;
    /**
     * Open a websocket connection to subscribe to logs matching the provided filters. Logs are
     * streamed in real-time as they are generated.
     *
     * You can query for logs across multiple resources, but all resources must be in the same
     * region and belong to the same owner.
     *
     * @summary Subscribe to new logs
     * @throws FetchError<400, types.SubscribeLogsResponse400> The request could not be understood by the server.
     * @throws FetchError<401, types.SubscribeLogsResponse401> Authorization information is missing or invalid.
     * @throws FetchError<403, types.SubscribeLogsResponse403> You do not have permissions for the requested resource.
     * @throws FetchError<404, types.SubscribeLogsResponse404> Unable to find the requested resource.
     * @throws FetchError<406, types.SubscribeLogsResponse406> Unable to generate preferred media types as specified by Accept request header.
     * @throws FetchError<410, types.SubscribeLogsResponse410> The requested resource is no longer available.
     * @throws FetchError<429, types.SubscribeLogsResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.SubscribeLogsResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.SubscribeLogsResponse503> Server currently unavailable.
     */
    subscribeLogs(metadata: types.SubscribeLogsMetadataParam): Promise<FetchResponse<101, types.SubscribeLogsResponse101>>;
    /**
     * List all values for a given log label in the logs matching the provided filters.
     *
     * @summary List log label values
     * @throws FetchError<400, types.ListLogsValuesResponse400> The request could not be understood by the server.
     * @throws FetchError<401, types.ListLogsValuesResponse401> Authorization information is missing or invalid.
     * @throws FetchError<403, types.ListLogsValuesResponse403> You do not have permissions for the requested resource.
     * @throws FetchError<404, types.ListLogsValuesResponse404> Unable to find the requested resource.
     * @throws FetchError<406, types.ListLogsValuesResponse406> Unable to generate preferred media types as specified by Accept request header.
     * @throws FetchError<410, types.ListLogsValuesResponse410> The requested resource is no longer available.
     * @throws FetchError<429, types.ListLogsValuesResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.ListLogsValuesResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.ListLogsValuesResponse503> Server currently unavailable.
     */
    listLogsValues(metadata: types.ListLogsValuesMetadataParam): Promise<FetchResponse<200, types.ListLogsValuesResponse200>>;
    /**
     * Returns log stream information for the specified workspace.
     *
     * @summary Retrieve log stream
     * @throws FetchError<400, types.GetOwnerLogStreamResponse400> The request could not be understood by the server.
     * @throws FetchError<401, types.GetOwnerLogStreamResponse401> Authorization information is missing or invalid.
     * @throws FetchError<403, types.GetOwnerLogStreamResponse403> You do not have permissions for the requested resource.
     * @throws FetchError<404, types.GetOwnerLogStreamResponse404> Unable to find the requested resource.
     * @throws FetchError<406, types.GetOwnerLogStreamResponse406> Unable to generate preferred media types as specified by Accept request header.
     * @throws FetchError<410, types.GetOwnerLogStreamResponse410> The requested resource is no longer available.
     * @throws FetchError<429, types.GetOwnerLogStreamResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.GetOwnerLogStreamResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.GetOwnerLogStreamResponse503> Server currently unavailable.
     */
    getOwnerLogStream(metadata: types.GetOwnerLogStreamMetadataParam): Promise<FetchResponse<200, types.GetOwnerLogStreamResponse200>>;
    /**
     * Updates log stream information for the specified workspace. All logs for resources owned
     * by this workspace will be sent to this log stream unless overridden by individual
     * resources.
     *
     * @summary Update log stream
     * @throws FetchError<400, types.UpdateOwnerLogStreamResponse400> The request could not be understood by the server.
     * @throws FetchError<401, types.UpdateOwnerLogStreamResponse401> Authorization information is missing or invalid.
     * @throws FetchError<403, types.UpdateOwnerLogStreamResponse403> You do not have permissions for the requested resource.
     * @throws FetchError<404, types.UpdateOwnerLogStreamResponse404> Unable to find the requested resource.
     * @throws FetchError<406, types.UpdateOwnerLogStreamResponse406> Unable to generate preferred media types as specified by Accept request header.
     * @throws FetchError<410, types.UpdateOwnerLogStreamResponse410> The requested resource is no longer available.
     * @throws FetchError<429, types.UpdateOwnerLogStreamResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.UpdateOwnerLogStreamResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.UpdateOwnerLogStreamResponse503> Server currently unavailable.
     */
    updateOwnerLogStream(body: types.UpdateOwnerLogStreamBodyParam, metadata: types.UpdateOwnerLogStreamMetadataParam): Promise<FetchResponse<200, types.UpdateOwnerLogStreamResponse200>>;
    /**
     * Removes the log stream for the specified workspace.
     *
     * @summary Delete log stream
     * @throws FetchError<400, types.DeleteOwnerLogStreamResponse400> The request could not be understood by the server.
     * @throws FetchError<401, types.DeleteOwnerLogStreamResponse401> Authorization information is missing or invalid.
     * @throws FetchError<404, types.DeleteOwnerLogStreamResponse404> Unable to find the requested resource.
     * @throws FetchError<429, types.DeleteOwnerLogStreamResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.DeleteOwnerLogStreamResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.DeleteOwnerLogStreamResponse503> Server currently unavailable.
     */
    deleteOwnerLogStream(metadata: types.DeleteOwnerLogStreamMetadataParam): Promise<FetchResponse<number, unknown>>;
    /**
     * Lists log stream overrides for the provided workspace that match the provided filters.
     * These overrides take precedence over the workspace's default log stream.
     *
     * @summary List log stream overrides
     * @throws FetchError<400, types.ListResourceLogStreamsResponse400> The request could not be understood by the server.
     * @throws FetchError<401, types.ListResourceLogStreamsResponse401> Authorization information is missing or invalid.
     * @throws FetchError<403, types.ListResourceLogStreamsResponse403> You do not have permissions for the requested resource.
     * @throws FetchError<404, types.ListResourceLogStreamsResponse404> Unable to find the requested resource.
     * @throws FetchError<406, types.ListResourceLogStreamsResponse406> Unable to generate preferred media types as specified by Accept request header.
     * @throws FetchError<410, types.ListResourceLogStreamsResponse410> The requested resource is no longer available.
     * @throws FetchError<429, types.ListResourceLogStreamsResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.ListResourceLogStreamsResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.ListResourceLogStreamsResponse503> Server currently unavailable.
     */
    listResourceLogStreams(metadata?: types.ListResourceLogStreamsMetadataParam): Promise<FetchResponse<200, types.ListResourceLogStreamsResponse200>>;
    /**
     * Returns log stream override information for the specified resource. A log stream
     * override takes precedence over a workspace's default log stream.
     *
     * @summary Retrieve log stream override
     * @throws FetchError<400, types.GetResourceLogStreamResponse400> The request could not be understood by the server.
     * @throws FetchError<401, types.GetResourceLogStreamResponse401> Authorization information is missing or invalid.
     * @throws FetchError<403, types.GetResourceLogStreamResponse403> You do not have permissions for the requested resource.
     * @throws FetchError<404, types.GetResourceLogStreamResponse404> Unable to find the requested resource.
     * @throws FetchError<406, types.GetResourceLogStreamResponse406> Unable to generate preferred media types as specified by Accept request header.
     * @throws FetchError<410, types.GetResourceLogStreamResponse410> The requested resource is no longer available.
     * @throws FetchError<429, types.GetResourceLogStreamResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.GetResourceLogStreamResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.GetResourceLogStreamResponse503> Server currently unavailable.
     */
    getResourceLogStream(metadata: types.GetResourceLogStreamMetadataParam): Promise<FetchResponse<200, types.GetResourceLogStreamResponse200>>;
    /**
     * Updates log stream override information for the specified resource. A log stream
     * override takes precedence over a workspace's default log stream.
     *
     * @summary Update log stream override
     * @throws FetchError<400, types.UpdateResourceLogStreamResponse400> The request could not be understood by the server.
     * @throws FetchError<401, types.UpdateResourceLogStreamResponse401> Authorization information is missing or invalid.
     * @throws FetchError<403, types.UpdateResourceLogStreamResponse403> You do not have permissions for the requested resource.
     * @throws FetchError<404, types.UpdateResourceLogStreamResponse404> Unable to find the requested resource.
     * @throws FetchError<406, types.UpdateResourceLogStreamResponse406> Unable to generate preferred media types as specified by Accept request header.
     * @throws FetchError<410, types.UpdateResourceLogStreamResponse410> The requested resource is no longer available.
     * @throws FetchError<429, types.UpdateResourceLogStreamResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.UpdateResourceLogStreamResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.UpdateResourceLogStreamResponse503> Server currently unavailable.
     */
    updateResourceLogStream(body: types.UpdateResourceLogStreamBodyParam, metadata: types.UpdateResourceLogStreamMetadataParam): Promise<FetchResponse<200, types.UpdateResourceLogStreamResponse200>>;
    /**
     * Removes the log stream override for the specified resource. After deletion, the resource
     * will use the workspace's default log stream setting.
     *
     * @summary Delete log stream override
     * @throws FetchError<400, types.DeleteResourceLogStreamResponse400> The request could not be understood by the server.
     * @throws FetchError<401, types.DeleteResourceLogStreamResponse401> Authorization information is missing or invalid.
     * @throws FetchError<404, types.DeleteResourceLogStreamResponse404> Unable to find the requested resource.
     * @throws FetchError<429, types.DeleteResourceLogStreamResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.DeleteResourceLogStreamResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.DeleteResourceLogStreamResponse503> Server currently unavailable.
     */
    deleteResourceLogStream(metadata: types.DeleteResourceLogStreamMetadataParam): Promise<FetchResponse<number, unknown>>;
    /**
     * Returns metrics stream information for the specified workspace.
     *
     * @summary Retrieve metrics stream
     * @throws FetchError<400, types.GetOwnerMetricsStreamResponse400> The request could not be understood by the server.
     * @throws FetchError<500, types.GetOwnerMetricsStreamResponse500> An unexpected server error has occurred.
     */
    getOwnerMetricsStream(metadata: types.GetOwnerMetricsStreamMetadataParam): Promise<FetchResponse<200, types.GetOwnerMetricsStreamResponse200>>;
    /**
     * Creates or updates the metrics stream for the specified workspace.
     *
     * @summary Create or update metrics stream
     * @throws FetchError<400, types.UpsertOwnerMetricsStreamResponse400> The request could not be understood by the server.
     * @throws FetchError<500, types.UpsertOwnerMetricsStreamResponse500> An unexpected server error has occurred.
     */
    upsertOwnerMetricsStream(body: types.UpsertOwnerMetricsStreamBodyParam, metadata: types.UpsertOwnerMetricsStreamMetadataParam): Promise<FetchResponse<200, types.UpsertOwnerMetricsStreamResponse200>>;
    /**
     * Deletes the metrics stream for the specified workspace.
     *
     * @summary Delete metrics stream
     * @throws FetchError<400, types.DeleteOwnerMetricsStreamResponse400> The request could not be understood by the server.
     * @throws FetchError<500, types.DeleteOwnerMetricsStreamResponse500> An unexpected server error has occurred.
     */
    deleteOwnerMetricsStream(metadata: types.DeleteOwnerMetricsStreamMetadataParam): Promise<FetchResponse<number, unknown>>;
    /**
     * Get CPU usage for one or more resources.
     *
     * @summary Get CPU usage
     * @throws FetchError<400, types.GetCpuResponse400> The request could not be understood by the server.
     * @throws FetchError<500, types.GetCpuResponse500> An unexpected server error has occurred.
     */
    getCpu(metadata?: types.GetCpuMetadataParam): Promise<FetchResponse<200, types.GetCpuResponse200>>;
    /**
     * Get the CPU limit for one or more resources.
     *
     * @summary Get CPU limit
     * @throws FetchError<400, types.GetCpuLimitResponse400> The request could not be understood by the server.
     * @throws FetchError<500, types.GetCpuLimitResponse500> An unexpected server error has occurred.
     */
    getCpuLimit(metadata?: types.GetCpuLimitMetadataParam): Promise<FetchResponse<200, types.GetCpuLimitResponse200>>;
    /**
     * Get CPU target for one or more resources.
     *
     * @summary Get CPU target
     * @throws FetchError<400, types.GetCpuTargetResponse400> The request could not be understood by the server.
     * @throws FetchError<500, types.GetCpuTargetResponse500> An unexpected server error has occurred.
     */
    getCpuTarget(metadata?: types.GetCpuTargetMetadataParam): Promise<FetchResponse<200, types.GetCpuTargetResponse200>>;
    /**
     * Get memory usage for one or more resources.
     *
     * @summary Get memory usage
     * @throws FetchError<400, types.GetMemoryResponse400> The request could not be understood by the server.
     * @throws FetchError<500, types.GetMemoryResponse500> An unexpected server error has occurred.
     */
    getMemory(metadata?: types.GetMemoryMetadataParam): Promise<FetchResponse<200, types.GetMemoryResponse200>>;
    /**
     * Get the memory limit for one or more resources.
     *
     * @summary Get memory limit
     * @throws FetchError<400, types.GetMemoryLimitResponse400> The request could not be understood by the server.
     * @throws FetchError<500, types.GetMemoryLimitResponse500> An unexpected server error has occurred.
     */
    getMemoryLimit(metadata?: types.GetMemoryLimitMetadataParam): Promise<FetchResponse<200, types.GetMemoryLimitResponse200>>;
    /**
     * Get memory target for one or more resources.
     *
     * @summary Get memory target
     * @throws FetchError<400, types.GetMemoryTargetResponse400> The request could not be understood by the server.
     * @throws FetchError<500, types.GetMemoryTargetResponse500> An unexpected server error has occurred.
     */
    getMemoryTarget(metadata?: types.GetMemoryTargetMetadataParam): Promise<FetchResponse<200, types.GetMemoryTargetResponse200>>;
    /**
     * Get the HTTP request count for one or more resources.
     *
     * @summary Get HTTP request count
     * @throws FetchError<400, types.GetHttpRequestsResponse400> The request could not be understood by the server.
     * @throws FetchError<500, types.GetHttpRequestsResponse500> An unexpected server error has occurred.
     */
    getHttpRequests(metadata?: types.GetHttpRequestsMetadataParam): Promise<FetchResponse<200, types.GetHttpRequestsResponse200>>;
    /**
     * Get HTTP latency metrics for one or more resources.
     *
     * @summary Get HTTP latency
     * @throws FetchError<400, types.GetHttpLatencyResponse400> The request could not be understood by the server.
     * @throws FetchError<500, types.GetHttpLatencyResponse500> An unexpected server error has occurred.
     */
    getHttpLatency(metadata?: types.GetHttpLatencyMetadataParam): Promise<FetchResponse<200, types.GetHttpLatencyResponse200>>;
    /**
     * Get bandwidth usage for one or more resources.
     *
     * @summary Get bandwidth usage
     * @throws FetchError<400, types.GetBandwidthResponse400> The request could not be understood by the server.
     * @throws FetchError<500, types.GetBandwidthResponse500> An unexpected server error has occurred.
     */
    getBandwidth(metadata?: types.GetBandwidthMetadataParam): Promise<FetchResponse<200, types.GetBandwidthResponse200>>;
    /**
     * Get persistent disk usage for one or more resources.
     *
     * @summary Get disk usage
     * @throws FetchError<400, types.GetDiskUsageResponse400> The request could not be understood by the server.
     * @throws FetchError<500, types.GetDiskUsageResponse500> An unexpected server error has occurred.
     */
    getDiskUsage(metadata?: types.GetDiskUsageMetadataParam): Promise<FetchResponse<200, types.GetDiskUsageResponse200>>;
    /**
     * Get persistent disk capacity for one or more resources.
     *
     * @summary Get disk capacity
     * @throws FetchError<400, types.GetDiskCapacityResponse400> The request could not be understood by the server.
     * @throws FetchError<500, types.GetDiskCapacityResponse500> An unexpected server error has occurred.
     */
    getDiskCapacity(metadata?: types.GetDiskCapacityMetadataParam): Promise<FetchResponse<200, types.GetDiskCapacityResponse200>>;
    /**
     * Get the instance count for one or more resources.
     *
     * @summary Get instance count
     * @throws FetchError<400, types.GetInstanceCountResponse400> The request could not be understood by the server.
     * @throws FetchError<500, types.GetInstanceCountResponse500> An unexpected server error has occurred.
     */
    getInstanceCount(metadata?: types.GetInstanceCountMetadataParam): Promise<FetchResponse<200, types.GetInstanceCountResponse200>>;
    /**
     * Get the number of active connections for one or more Postgres databases or Redis
     * instances.
     *
     * @summary Get active connection count
     * @throws FetchError<400, types.GetActiveConnectionsResponse400> The request could not be understood by the server.
     * @throws FetchError<500, types.GetActiveConnectionsResponse500> An unexpected server error has occurred.
     */
    getActiveConnections(metadata?: types.GetActiveConnectionsMetadataParam): Promise<FetchResponse<200, types.GetActiveConnectionsResponse200>>;
    /**
     * Get seconds of replica lag of a Postgres replica.
     *
     * @summary Get replica lag
     * @throws FetchError<400, types.GetReplicationLagResponse400> The request could not be understood by the server.
     * @throws FetchError<500, types.GetReplicationLagResponse500> An unexpected server error has occurred.
     */
    getReplicationLag(metadata?: types.GetReplicationLagMetadataParam): Promise<FetchResponse<200, types.GetReplicationLagResponse200>>;
    /**
     * List instance values to filter by for one or more resources.
     *
     * @summary List queryable instance values
     * @throws FetchError<400, types.ListApplicationFilterValuesResponse400> The request could not be understood by the server.
     * @throws FetchError<500, types.ListApplicationFilterValuesResponse500> An unexpected server error has occurred.
     */
    listApplicationFilterValues(metadata?: types.ListApplicationFilterValuesMetadataParam): Promise<FetchResponse<200, types.ListApplicationFilterValuesResponse200>>;
    /**
     * List status codes and host values to filter by for one or more resources.
     *
     * @summary List queryable status codes and host values
     * @throws FetchError<400, types.ListHttpFilterValuesResponse400> The request could not be understood by the server.
     * @throws FetchError<500, types.ListHttpFilterValuesResponse500> An unexpected server error has occurred.
     */
    listHttpFilterValues(metadata?: types.ListHttpFilterValuesMetadataParam): Promise<FetchResponse<200, types.ListHttpFilterValuesResponse200>>;
    /**
     * The path suggestions are based on the most recent 5000 log lines as filtered by the
     * provided filters
     *
     * @summary List queryable paths
     * @throws FetchError<400, types.ListPathFilterValuesResponse400> The request could not be understood by the server.
     * @throws FetchError<500, types.ListPathFilterValuesResponse500> An unexpected server error has occurred.
     */
    listPathFilterValues(metadata?: types.ListPathFilterValuesMetadataParam): Promise<FetchResponse<200, types.ListPathFilterValuesResponse200>>;
    /**
     * List Key Value instances matching the provided filters. If no filters are provided, all
     * Key Value instances are returned.
     *
     * @summary List Key Value instances
     * @throws FetchError<400, types.ListKeyValueResponse400> The request could not be understood by the server.
     * @throws FetchError<401, types.ListKeyValueResponse401> Authorization information is missing or invalid.
     * @throws FetchError<404, types.ListKeyValueResponse404> Unable to find the requested resource.
     * @throws FetchError<409, types.ListKeyValueResponse409> The current state of the resource conflicts with this request.
     * @throws FetchError<429, types.ListKeyValueResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.ListKeyValueResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.ListKeyValueResponse503> Server currently unavailable.
     */
    listKeyValue(metadata?: types.ListKeyValueMetadataParam): Promise<FetchResponse<200, types.ListKeyValueResponse200>>;
    /**
     * Create a new Key Value instance.
     *
     * @summary Create Key Value instance
     * @throws FetchError<400, types.CreateKeyValueResponse400> The request could not be understood by the server.
     * @throws FetchError<401, types.CreateKeyValueResponse401> Authorization information is missing or invalid.
     * @throws FetchError<404, types.CreateKeyValueResponse404> Unable to find the requested resource.
     * @throws FetchError<429, types.CreateKeyValueResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.CreateKeyValueResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.CreateKeyValueResponse503> Server currently unavailable.
     */
    createKeyValue(body: types.CreateKeyValueBodyParam): Promise<FetchResponse<201, types.CreateKeyValueResponse201>>;
    /**
     * Retrieve a Key Value instance by ID.
     *
     * @summary Retrieve Key Value instance
     * @throws FetchError<400, types.RetrieveKeyValueResponse400> The request could not be understood by the server.
     * @throws FetchError<401, types.RetrieveKeyValueResponse401> Authorization information is missing or invalid.
     * @throws FetchError<404, types.RetrieveKeyValueResponse404> Unable to find the requested resource.
     * @throws FetchError<429, types.RetrieveKeyValueResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.RetrieveKeyValueResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.RetrieveKeyValueResponse503> Server currently unavailable.
     */
    retrieveKeyValue(metadata: types.RetrieveKeyValueMetadataParam): Promise<FetchResponse<200, types.RetrieveKeyValueResponse200>>;
    /**
     * Update a Key Value instance by ID.
     *
     * @summary Update Key Value instance
     * @throws FetchError<400, types.UpdateKeyValueResponse400> The request could not be understood by the server.
     * @throws FetchError<401, types.UpdateKeyValueResponse401> Authorization information is missing or invalid.
     * @throws FetchError<404, types.UpdateKeyValueResponse404> Unable to find the requested resource.
     * @throws FetchError<409, types.UpdateKeyValueResponse409> The current state of the resource conflicts with this request.
     * @throws FetchError<429, types.UpdateKeyValueResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.UpdateKeyValueResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.UpdateKeyValueResponse503> Server currently unavailable.
     */
    updateKeyValue(body: types.UpdateKeyValueBodyParam, metadata: types.UpdateKeyValueMetadataParam): Promise<FetchResponse<200, types.UpdateKeyValueResponse200>>;
    /**
     * Delete a Key Value instance by ID.
     *
     * @summary Delete Key Value instance
     * @throws FetchError<400, types.DeleteKeyValueResponse400> The request could not be understood by the server.
     * @throws FetchError<401, types.DeleteKeyValueResponse401> Authorization information is missing or invalid.
     * @throws FetchError<404, types.DeleteKeyValueResponse404> Unable to find the requested resource.
     * @throws FetchError<429, types.DeleteKeyValueResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.DeleteKeyValueResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.DeleteKeyValueResponse503> Server currently unavailable.
     */
    deleteKeyValue(metadata: types.DeleteKeyValueMetadataParam): Promise<FetchResponse<number, unknown>>;
    /**
     * Retrieve connection info for a Key Value instance by ID. Connection info includes
     * sensitive information.
     *
     * @summary Retrieve Key Value connection info
     * @throws FetchError<400, types.RetrieveKeyValueConnectionInfoResponse400> The request could not be understood by the server.
     * @throws FetchError<401, types.RetrieveKeyValueConnectionInfoResponse401> Authorization information is missing or invalid.
     * @throws FetchError<404, types.RetrieveKeyValueConnectionInfoResponse404> Unable to find the requested resource.
     * @throws FetchError<429, types.RetrieveKeyValueConnectionInfoResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.RetrieveKeyValueConnectionInfoResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.RetrieveKeyValueConnectionInfoResponse503> Server currently unavailable.
     */
    retrieveKeyValueConnectionInfo(metadata: types.RetrieveKeyValueConnectionInfoMetadataParam): Promise<FetchResponse<200, types.RetrieveKeyValueConnectionInfoResponse200>>;
    /**
     * List Redis instances matching the provided filters. If no filters are provided, all
     * Redis instances are returned.
     *
     * @summary List Redis instances
     * @throws FetchError<400, types.ListRedisResponse400> The request could not be understood by the server.
     * @throws FetchError<401, types.ListRedisResponse401> Authorization information is missing or invalid.
     * @throws FetchError<404, types.ListRedisResponse404> Unable to find the requested resource.
     * @throws FetchError<409, types.ListRedisResponse409> The current state of the resource conflicts with this request.
     * @throws FetchError<429, types.ListRedisResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.ListRedisResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.ListRedisResponse503> Server currently unavailable.
     */
    listRedis(metadata?: types.ListRedisMetadataParam): Promise<FetchResponse<200, types.ListRedisResponse200>>;
    /**
     * Create a new Redis instance.
     *
     * @summary Create Redis instance
     * @throws FetchError<400, types.CreateRedisResponse400> The request could not be understood by the server.
     * @throws FetchError<401, types.CreateRedisResponse401> Authorization information is missing or invalid.
     * @throws FetchError<404, types.CreateRedisResponse404> Unable to find the requested resource.
     * @throws FetchError<429, types.CreateRedisResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.CreateRedisResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.CreateRedisResponse503> Server currently unavailable.
     */
    createRedis(body: types.CreateRedisBodyParam): Promise<FetchResponse<201, types.CreateRedisResponse201>>;
    /**
     * Retrieve a Redis instance by ID.
     *
     * @summary Retrieve Redis instance
     * @throws FetchError<400, types.RetrieveRedisResponse400> The request could not be understood by the server.
     * @throws FetchError<401, types.RetrieveRedisResponse401> Authorization information is missing or invalid.
     * @throws FetchError<404, types.RetrieveRedisResponse404> Unable to find the requested resource.
     * @throws FetchError<429, types.RetrieveRedisResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.RetrieveRedisResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.RetrieveRedisResponse503> Server currently unavailable.
     */
    retrieveRedis(metadata: types.RetrieveRedisMetadataParam): Promise<FetchResponse<200, types.RetrieveRedisResponse200>>;
    /**
     * Update a Redis instance by ID.
     *
     * @summary Update Redis instance
     * @throws FetchError<400, types.UpdateRedisResponse400> The request could not be understood by the server.
     * @throws FetchError<401, types.UpdateRedisResponse401> Authorization information is missing or invalid.
     * @throws FetchError<404, types.UpdateRedisResponse404> Unable to find the requested resource.
     * @throws FetchError<409, types.UpdateRedisResponse409> The current state of the resource conflicts with this request.
     * @throws FetchError<429, types.UpdateRedisResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.UpdateRedisResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.UpdateRedisResponse503> Server currently unavailable.
     */
    updateRedis(body: types.UpdateRedisBodyParam, metadata: types.UpdateRedisMetadataParam): Promise<FetchResponse<200, types.UpdateRedisResponse200>>;
    /**
     * Delete a Redis instance by ID.
     *
     * @summary Delete Redis instance
     * @throws FetchError<400, types.DeleteRedisResponse400> The request could not be understood by the server.
     * @throws FetchError<401, types.DeleteRedisResponse401> Authorization information is missing or invalid.
     * @throws FetchError<404, types.DeleteRedisResponse404> Unable to find the requested resource.
     * @throws FetchError<429, types.DeleteRedisResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.DeleteRedisResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.DeleteRedisResponse503> Server currently unavailable.
     */
    deleteRedis(metadata: types.DeleteRedisMetadataParam): Promise<FetchResponse<number, unknown>>;
    /**
     * Retrieve connection info for a Redis instance by ID. Connection info includes sensitive
     * information.
     *
     * @summary Retrieve Redis connection info
     * @throws FetchError<400, types.RetrieveRedisConnectionInfoResponse400> The request could not be understood by the server.
     * @throws FetchError<401, types.RetrieveRedisConnectionInfoResponse401> Authorization information is missing or invalid.
     * @throws FetchError<404, types.RetrieveRedisConnectionInfoResponse404> Unable to find the requested resource.
     * @throws FetchError<429, types.RetrieveRedisConnectionInfoResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.RetrieveRedisConnectionInfoResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.RetrieveRedisConnectionInfoResponse503> Server currently unavailable.
     */
    retrieveRedisConnectionInfo(metadata: types.RetrieveRedisConnectionInfoMetadataParam): Promise<FetchResponse<200, types.RetrieveRedisConnectionInfoResponse200>>;
    /**
     * List Postgres instances matching the provided filters. If no filters are provided, all
     * Postgres instances are returned.
     *
     * @summary List Postgres instances
     * @throws FetchError<400, types.ListPostgresResponse400> The request could not be understood by the server.
     * @throws FetchError<401, types.ListPostgresResponse401> Authorization information is missing or invalid.
     * @throws FetchError<404, types.ListPostgresResponse404> Unable to find the requested resource.
     * @throws FetchError<409, types.ListPostgresResponse409> The current state of the resource conflicts with this request.
     * @throws FetchError<429, types.ListPostgresResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.ListPostgresResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.ListPostgresResponse503> Server currently unavailable.
     */
    listPostgres(metadata?: types.ListPostgresMetadataParam): Promise<FetchResponse<200, types.ListPostgresResponse200>>;
    /**
     * Create a new Postgres instance.
     *
     * @summary Create Postgres instance
     * @throws FetchError<400, types.CreatePostgresResponse400> The request could not be understood by the server.
     * @throws FetchError<401, types.CreatePostgresResponse401> Authorization information is missing or invalid.
     * @throws FetchError<404, types.CreatePostgresResponse404> Unable to find the requested resource.
     * @throws FetchError<429, types.CreatePostgresResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.CreatePostgresResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.CreatePostgresResponse503> Server currently unavailable.
     */
    createPostgres(body: types.CreatePostgresBodyParam): Promise<FetchResponse<201, types.CreatePostgresResponse201>>;
    /**
     * Retrieve a Postgres instance by ID.
     *
     * @summary Retrieve Postgres instance
     * @throws FetchError<400, types.RetrievePostgresResponse400> The request could not be understood by the server.
     * @throws FetchError<401, types.RetrievePostgresResponse401> Authorization information is missing or invalid.
     * @throws FetchError<404, types.RetrievePostgresResponse404> Unable to find the requested resource.
     * @throws FetchError<429, types.RetrievePostgresResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.RetrievePostgresResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.RetrievePostgresResponse503> Server currently unavailable.
     */
    retrievePostgres(metadata: types.RetrievePostgresMetadataParam): Promise<FetchResponse<200, types.RetrievePostgresResponse200>>;
    /**
     * Update a Postgres instance by ID.
     *
     * @summary Update Postgres instance
     * @throws FetchError<400, types.UpdatePostgresResponse400> The request could not be understood by the server.
     * @throws FetchError<401, types.UpdatePostgresResponse401> Authorization information is missing or invalid.
     * @throws FetchError<404, types.UpdatePostgresResponse404> Unable to find the requested resource.
     * @throws FetchError<409, types.UpdatePostgresResponse409> The current state of the resource conflicts with this request.
     * @throws FetchError<429, types.UpdatePostgresResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.UpdatePostgresResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.UpdatePostgresResponse503> Server currently unavailable.
     */
    updatePostgres(body: types.UpdatePostgresBodyParam, metadata: types.UpdatePostgresMetadataParam): Promise<FetchResponse<200, types.UpdatePostgresResponse200>>;
    /**
     * Delete a Postgres instance by ID. This operation is irreversible, and
     * all data will be lost.
     *
     * @summary Delete Postgres instance
     * @throws FetchError<400, types.DeletePostgresResponse400> The request could not be understood by the server.
     * @throws FetchError<401, types.DeletePostgresResponse401> Authorization information is missing or invalid.
     * @throws FetchError<404, types.DeletePostgresResponse404> Unable to find the requested resource.
     * @throws FetchError<429, types.DeletePostgresResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.DeletePostgresResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.DeletePostgresResponse503> Server currently unavailable.
     */
    deletePostgres(metadata: types.DeletePostgresMetadataParam): Promise<FetchResponse<number, unknown>>;
    /**
     * Retrieve connection info for a Postgres instance by ID. Connection info includes
     * sensitive information.
     *
     * @summary Retrieve Postgres connection info
     * @throws FetchError<400, types.RetrievePostgresConnectionInfoResponse400> The request could not be understood by the server.
     * @throws FetchError<401, types.RetrievePostgresConnectionInfoResponse401> Authorization information is missing or invalid.
     * @throws FetchError<404, types.RetrievePostgresConnectionInfoResponse404> Unable to find the requested resource.
     * @throws FetchError<429, types.RetrievePostgresConnectionInfoResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.RetrievePostgresConnectionInfoResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.RetrievePostgresConnectionInfoResponse503> Server currently unavailable.
     */
    retrievePostgresConnectionInfo(metadata: types.RetrievePostgresConnectionInfoMetadataParam): Promise<FetchResponse<200, types.RetrievePostgresConnectionInfoResponse200>>;
    /**
     * Retrieve information on the availability of Postgres point-in-time recovery for a
     * Postgres instance by ID.
     *
     * @summary Retrieve point-in-time recovery status
     * @throws FetchError<400, types.RetrievePostgresRecoveryInfoResponse400> The request could not be understood by the server.
     * @throws FetchError<401, types.RetrievePostgresRecoveryInfoResponse401> Authorization information is missing or invalid.
     * @throws FetchError<404, types.RetrievePostgresRecoveryInfoResponse404> Unable to find the requested resource.
     * @throws FetchError<429, types.RetrievePostgresRecoveryInfoResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.RetrievePostgresRecoveryInfoResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.RetrievePostgresRecoveryInfoResponse503> Server currently unavailable.
     */
    retrievePostgresRecoveryInfo(metadata: types.RetrievePostgresRecoveryInfoMetadataParam): Promise<FetchResponse<200, types.RetrievePostgresRecoveryInfoResponse200>>;
    /**
     * Trigger [point-in-time
     * recovery](https://docs.render.com/postgresql-backups#point-in-time-recovery) on the
     * Postgres instance with the provided ID.
     *
     * @summary Trigger point-in-time recovery
     * @throws FetchError<400, types.RecoverPostgresResponse400> The request could not be understood by the server.
     * @throws FetchError<401, types.RecoverPostgresResponse401> Authorization information is missing or invalid.
     * @throws FetchError<403, types.RecoverPostgresResponse403> You do not have permissions for the requested resource.
     * @throws FetchError<404, types.RecoverPostgresResponse404> Unable to find the requested resource.
     * @throws FetchError<406, types.RecoverPostgresResponse406> Unable to generate preferred media types as specified by Accept request header.
     * @throws FetchError<410, types.RecoverPostgresResponse410> The requested resource is no longer available.
     * @throws FetchError<429, types.RecoverPostgresResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.RecoverPostgresResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.RecoverPostgresResponse503> Server currently unavailable.
     */
    recoverPostgres(body: types.RecoverPostgresBodyParam, metadata: types.RecoverPostgresMetadataParam): Promise<FetchResponse<200, types.RecoverPostgresResponse200>>;
    /**
     * Suspend a Postgres instance by ID.
     *
     * @summary Suspend Postgres instance
     * @throws FetchError<400, types.SuspendPostgresResponse400> The request could not be understood by the server.
     * @throws FetchError<401, types.SuspendPostgresResponse401> Authorization information is missing or invalid.
     * @throws FetchError<403, types.SuspendPostgresResponse403> You do not have permissions for the requested resource.
     * @throws FetchError<404, types.SuspendPostgresResponse404> Unable to find the requested resource.
     * @throws FetchError<406, types.SuspendPostgresResponse406> Unable to generate preferred media types as specified by Accept request header.
     * @throws FetchError<410, types.SuspendPostgresResponse410> The requested resource is no longer available.
     * @throws FetchError<429, types.SuspendPostgresResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.SuspendPostgresResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.SuspendPostgresResponse503> Server currently unavailable.
     */
    suspendPostgres(metadata: types.SuspendPostgresMetadataParam): Promise<FetchResponse<number, unknown>>;
    /**
     * Resume a Postgres instance by ID.
     *
     * @summary Resume Postgres instance
     * @throws FetchError<400, types.ResumePostgresResponse400> The request could not be understood by the server.
     * @throws FetchError<401, types.ResumePostgresResponse401> Authorization information is missing or invalid.
     * @throws FetchError<403, types.ResumePostgresResponse403> You do not have permissions for the requested resource.
     * @throws FetchError<404, types.ResumePostgresResponse404> Unable to find the requested resource.
     * @throws FetchError<406, types.ResumePostgresResponse406> Unable to generate preferred media types as specified by Accept request header.
     * @throws FetchError<410, types.ResumePostgresResponse410> The requested resource is no longer available.
     * @throws FetchError<429, types.ResumePostgresResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.ResumePostgresResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.ResumePostgresResponse503> Server currently unavailable.
     */
    resumePostgres(metadata: types.ResumePostgresMetadataParam): Promise<FetchResponse<number, unknown>>;
    /**
     * Restart a Postgres instance by ID.
     *
     * @summary Restart Postgres instance
     * @throws FetchError<400, types.RestartPostgresResponse400> The request could not be understood by the server.
     * @throws FetchError<401, types.RestartPostgresResponse401> Authorization information is missing or invalid.
     * @throws FetchError<403, types.RestartPostgresResponse403> You do not have permissions for the requested resource.
     * @throws FetchError<404, types.RestartPostgresResponse404> Unable to find the requested resource.
     * @throws FetchError<406, types.RestartPostgresResponse406> Unable to generate preferred media types as specified by Accept request header.
     * @throws FetchError<410, types.RestartPostgresResponse410> The requested resource is no longer available.
     * @throws FetchError<429, types.RestartPostgresResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.RestartPostgresResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.RestartPostgresResponse503> Server currently unavailable.
     */
    restartPostgres(metadata: types.RestartPostgresMetadataParam): Promise<FetchResponse<number, unknown>>;
    /**
     * Failover a [highly available
     * Postgres](https://docs.render.com/postgresql-high-availability) instance.
     *
     * @summary Failover Postgres instance
     * @throws FetchError<400, types.FailoverPostgresResponse400> The request could not be understood by the server.
     * @throws FetchError<401, types.FailoverPostgresResponse401> Authorization information is missing or invalid.
     * @throws FetchError<403, types.FailoverPostgresResponse403> You do not have permissions for the requested resource.
     * @throws FetchError<404, types.FailoverPostgresResponse404> Unable to find the requested resource.
     * @throws FetchError<406, types.FailoverPostgresResponse406> Unable to generate preferred media types as specified by Accept request header.
     * @throws FetchError<410, types.FailoverPostgresResponse410> The requested resource is no longer available.
     * @throws FetchError<429, types.FailoverPostgresResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.FailoverPostgresResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.FailoverPostgresResponse503> Server currently unavailable.
     */
    failoverPostgres(metadata: types.FailoverPostgresMetadataParam): Promise<FetchResponse<number, unknown>>;
    /**
     * List [exports](https://docs.render.com/postgresql-backups#logical-backups) for a
     * Postgres instance by ID. Returns a URL to download the export.
     *
     * @summary List Postgres exports
     * @throws FetchError<400, types.ListPostgresExportResponse400> The request could not be understood by the server.
     * @throws FetchError<401, types.ListPostgresExportResponse401> Authorization information is missing or invalid.
     * @throws FetchError<404, types.ListPostgresExportResponse404> Unable to find the requested resource.
     * @throws FetchError<429, types.ListPostgresExportResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.ListPostgresExportResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.ListPostgresExportResponse503> Server currently unavailable.
     */
    listPostgresExport(metadata: types.ListPostgresExportMetadataParam): Promise<FetchResponse<200, types.ListPostgresExportResponse200>>;
    /**
     * Create an [export](https://docs.render.com/postgresql-backups#logical-backups) of a
     * Postgres instance by ID.
     *
     * @summary Create Postgres export
     * @throws FetchError<400, types.CreatePostgresExportResponse400> The request could not be understood by the server.
     * @throws FetchError<401, types.CreatePostgresExportResponse401> Authorization information is missing or invalid.
     * @throws FetchError<403, types.CreatePostgresExportResponse403> You do not have permissions for the requested resource.
     * @throws FetchError<404, types.CreatePostgresExportResponse404> Unable to find the requested resource.
     * @throws FetchError<406, types.CreatePostgresExportResponse406> Unable to generate preferred media types as specified by Accept request header.
     * @throws FetchError<410, types.CreatePostgresExportResponse410> The requested resource is no longer available.
     * @throws FetchError<429, types.CreatePostgresExportResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.CreatePostgresExportResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.CreatePostgresExportResponse503> Server currently unavailable.
     */
    createPostgresExport(metadata: types.CreatePostgresExportMetadataParam): Promise<FetchResponse<number, unknown>>;
    /**
     * List projects matching the provided filters. If no filters are provided, all projects
     * are returned.
     *
     * @summary List projects
     * @throws FetchError<400, types.ListProjectsResponse400> The request could not be understood by the server.
     * @throws FetchError<401, types.ListProjectsResponse401> Authorization information is missing or invalid.
     * @throws FetchError<404, types.ListProjectsResponse404> Unable to find the requested resource.
     * @throws FetchError<429, types.ListProjectsResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.ListProjectsResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.ListProjectsResponse503> Server currently unavailable.
     */
    listProjects(metadata?: types.ListProjectsMetadataParam): Promise<FetchResponse<200, types.ListProjectsResponse200>>;
    /**
     * Create a new project.
     *
     * @summary Create project
     * @throws FetchError<400, types.CreateProjectResponse400> The request could not be understood by the server.
     * @throws FetchError<401, types.CreateProjectResponse401> Authorization information is missing or invalid.
     * @throws FetchError<404, types.CreateProjectResponse404> Unable to find the requested resource.
     * @throws FetchError<429, types.CreateProjectResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.CreateProjectResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.CreateProjectResponse503> Server currently unavailable.
     */
    createProject(body: types.CreateProjectBodyParam): Promise<FetchResponse<201, types.CreateProjectResponse201>>;
    /**
     * Retrieve the project with the provided ID.
     *
     * @summary Retrieve Project
     * @throws FetchError<400, types.RetrieveProjectResponse400> The request could not be understood by the server.
     * @throws FetchError<401, types.RetrieveProjectResponse401> Authorization information is missing or invalid.
     * @throws FetchError<404, types.RetrieveProjectResponse404> Unable to find the requested resource.
     * @throws FetchError<429, types.RetrieveProjectResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.RetrieveProjectResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.RetrieveProjectResponse503> Server currently unavailable.
     */
    retrieveProject(metadata: types.RetrieveProjectMetadataParam): Promise<FetchResponse<200, types.RetrieveProjectResponse200>>;
    /**
     * Update the details of a project.
     *
     * To update the details of a particular _environment_ in the project, instead use the
     * [Update environment](https://api-docs.render.com/reference/update-environment) endpoint.
     *
     * @summary Update project
     * @throws FetchError<400, types.UpdateProjectResponse400> The request could not be understood by the server.
     * @throws FetchError<401, types.UpdateProjectResponse401> Authorization information is missing or invalid.
     * @throws FetchError<404, types.UpdateProjectResponse404> Unable to find the requested resource.
     * @throws FetchError<429, types.UpdateProjectResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.UpdateProjectResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.UpdateProjectResponse503> Server currently unavailable.
     */
    updateProject(body: types.UpdateProjectBodyParam, metadata: types.UpdateProjectMetadataParam): Promise<FetchResponse<200, types.UpdateProjectResponse200>>;
    /**
     * Delete the project with the provided ID, along with all environments and services in
     * that project.
     *
     * **This operation is irreversible.** All services and other resources belonging to the
     * project will be deleted.
     *
     * @summary Delete project
     * @throws FetchError<400, types.DeleteProjectResponse400> The request could not be understood by the server.
     * @throws FetchError<401, types.DeleteProjectResponse401> Authorization information is missing or invalid.
     * @throws FetchError<404, types.DeleteProjectResponse404> Unable to find the requested resource.
     * @throws FetchError<429, types.DeleteProjectResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.DeleteProjectResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.DeleteProjectResponse503> Server currently unavailable.
     */
    deleteProject(metadata: types.DeleteProjectMetadataParam): Promise<FetchResponse<number, unknown>>;
    /**
     * Create a new environment belonging to the project with the provided ID.
     *
     * @summary Create environment
     * @throws FetchError<400, types.CreateEnvironmentResponse400> The request could not be understood by the server.
     * @throws FetchError<401, types.CreateEnvironmentResponse401> Authorization information is missing or invalid.
     * @throws FetchError<404, types.CreateEnvironmentResponse404> Unable to find the requested resource.
     * @throws FetchError<429, types.CreateEnvironmentResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.CreateEnvironmentResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.CreateEnvironmentResponse503> Server currently unavailable.
     */
    createEnvironment(body: types.CreateEnvironmentBodyParam): Promise<FetchResponse<201, types.CreateEnvironmentResponse201>>;
    /**
     * List a particular project's environments matching the provided filters. If no filters
     * are provided, all environments are returned.
     *
     * @summary List environments
     * @throws FetchError<400, types.ListEnvironmentsResponse400> The request could not be understood by the server.
     * @throws FetchError<401, types.ListEnvironmentsResponse401> Authorization information is missing or invalid.
     * @throws FetchError<404, types.ListEnvironmentsResponse404> Unable to find the requested resource.
     * @throws FetchError<429, types.ListEnvironmentsResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.ListEnvironmentsResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.ListEnvironmentsResponse503> Server currently unavailable.
     */
    listEnvironments(metadata: types.ListEnvironmentsMetadataParam): Promise<FetchResponse<200, types.ListEnvironmentsResponse200>>;
    /**
     * Retrieve the environment with the provided ID.
     *
     * @summary Retrieve environment
     * @throws FetchError<400, types.RetrieveEnvironmentResponse400> The request could not be understood by the server.
     * @throws FetchError<401, types.RetrieveEnvironmentResponse401> Authorization information is missing or invalid.
     * @throws FetchError<404, types.RetrieveEnvironmentResponse404> Unable to find the requested resource.
     * @throws FetchError<429, types.RetrieveEnvironmentResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.RetrieveEnvironmentResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.RetrieveEnvironmentResponse503> Server currently unavailable.
     */
    retrieveEnvironment(metadata: types.RetrieveEnvironmentMetadataParam): Promise<FetchResponse<200, types.RetrieveEnvironmentResponse200>>;
    /**
     * Update the details of the environment with the provided ID.
     *
     * @summary Update environment
     * @throws FetchError<400, types.UpdateEnvironmentResponse400> The request could not be understood by the server.
     * @throws FetchError<401, types.UpdateEnvironmentResponse401> Authorization information is missing or invalid.
     * @throws FetchError<404, types.UpdateEnvironmentResponse404> Unable to find the requested resource.
     * @throws FetchError<429, types.UpdateEnvironmentResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.UpdateEnvironmentResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.UpdateEnvironmentResponse503> Server currently unavailable.
     */
    updateEnvironment(body: types.UpdateEnvironmentBodyParam, metadata: types.UpdateEnvironmentMetadataParam): Promise<FetchResponse<200, types.UpdateEnvironmentResponse200>>;
    /**
     * Delete the environment with the provided ID, along with all resources that belong to it.
     *
     * **This operation is irreversible.** All services and other resources belonging to the
     * environment will be deleted.
     *
     * @summary Delete environment
     * @throws FetchError<400, types.DeleteEnvironmentResponse400> The request could not be understood by the server.
     * @throws FetchError<401, types.DeleteEnvironmentResponse401> Authorization information is missing or invalid.
     * @throws FetchError<404, types.DeleteEnvironmentResponse404> Unable to find the requested resource.
     * @throws FetchError<429, types.DeleteEnvironmentResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.DeleteEnvironmentResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.DeleteEnvironmentResponse503> Server currently unavailable.
     */
    deleteEnvironment(metadata: types.DeleteEnvironmentMetadataParam): Promise<FetchResponse<number, unknown>>;
    /**
     * Add resources to the environment with the provided ID.
     *
     * @summary Add resources to environment
     * @throws FetchError<400, types.AddResourcesToEnvironmentResponse400> The request could not be understood by the server.
     * @throws FetchError<401, types.AddResourcesToEnvironmentResponse401> Authorization information is missing or invalid.
     * @throws FetchError<404, types.AddResourcesToEnvironmentResponse404> Unable to find the requested resource.
     * @throws FetchError<429, types.AddResourcesToEnvironmentResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.AddResourcesToEnvironmentResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.AddResourcesToEnvironmentResponse503> Server currently unavailable.
     */
    addResourcesToEnvironment(body: types.AddResourcesToEnvironmentBodyParam, metadata: types.AddResourcesToEnvironmentMetadataParam): Promise<FetchResponse<200, types.AddResourcesToEnvironmentResponse200>>;
    /**
     * Remove resources from the environment with the provided ID.
     *
     * @summary Remove resources from environment
     * @throws FetchError<400, types.RemoveResourcesFromEnvironmentResponse400> The request could not be understood by the server.
     * @throws FetchError<401, types.RemoveResourcesFromEnvironmentResponse401> Authorization information is missing or invalid.
     * @throws FetchError<404, types.RemoveResourcesFromEnvironmentResponse404> Unable to find the requested resource.
     * @throws FetchError<429, types.RemoveResourcesFromEnvironmentResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.RemoveResourcesFromEnvironmentResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.RemoveResourcesFromEnvironmentResponse503> Server currently unavailable.
     */
    removeResourcesFromEnvironment(metadata: types.RemoveResourcesFromEnvironmentMetadataParam): Promise<FetchResponse<number, unknown>>;
    /**
     * List environment groups matching the provided filters. If no filters are provided, all
     * environment groups are returned.
     *
     * @summary List environment groups
     * @throws FetchError<400, types.ListEnvGroupsResponse400> The request could not be understood by the server.
     * @throws FetchError<401, types.ListEnvGroupsResponse401> Authorization information is missing or invalid.
     * @throws FetchError<404, types.ListEnvGroupsResponse404> Unable to find the requested resource.
     * @throws FetchError<429, types.ListEnvGroupsResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.ListEnvGroupsResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.ListEnvGroupsResponse503> Server currently unavailable.
     */
    listEnvGroups(metadata?: types.ListEnvGroupsMetadataParam): Promise<FetchResponse<200, types.ListEnvGroupsResponse200>>;
    /**
     * Create a new environment group.
     *
     * @summary Create environment group
     * @throws FetchError<400, types.CreateEnvGroupResponse400> The request could not be understood by the server.
     * @throws FetchError<401, types.CreateEnvGroupResponse401> Authorization information is missing or invalid.
     * @throws FetchError<404, types.CreateEnvGroupResponse404> Unable to find the requested resource.
     * @throws FetchError<429, types.CreateEnvGroupResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.CreateEnvGroupResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.CreateEnvGroupResponse503> Server currently unavailable.
     */
    createEnvGroup(body: types.CreateEnvGroupBodyParam): Promise<FetchResponse<201, types.CreateEnvGroupResponse201>>;
    /**
     * Retrieve an environment group by ID.
     *
     * @summary Retrieve environment group
     * @throws FetchError<400, types.RetrieveEnvGroupResponse400> The request could not be understood by the server.
     * @throws FetchError<401, types.RetrieveEnvGroupResponse401> Authorization information is missing or invalid.
     * @throws FetchError<404, types.RetrieveEnvGroupResponse404> Unable to find the requested resource.
     * @throws FetchError<429, types.RetrieveEnvGroupResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.RetrieveEnvGroupResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.RetrieveEnvGroupResponse503> Server currently unavailable.
     */
    retrieveEnvGroup(metadata: types.RetrieveEnvGroupMetadataParam): Promise<FetchResponse<200, types.RetrieveEnvGroupResponse200>>;
    /**
     * Update the attributes of an environment group.
     *
     * @summary Update environment group
     * @throws FetchError<400, types.UpdateEnvGroupResponse400> The request could not be understood by the server.
     * @throws FetchError<401, types.UpdateEnvGroupResponse401> Authorization information is missing or invalid.
     * @throws FetchError<404, types.UpdateEnvGroupResponse404> Unable to find the requested resource.
     * @throws FetchError<429, types.UpdateEnvGroupResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.UpdateEnvGroupResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.UpdateEnvGroupResponse503> Server currently unavailable.
     */
    updateEnvGroup(body: types.UpdateEnvGroupBodyParam, metadata: types.UpdateEnvGroupMetadataParam): Promise<FetchResponse<200, types.UpdateEnvGroupResponse200>>;
    /**
     * Delete the environment group with the provided ID, including all environment variables
     * and secret files it contains.
     *
     * @summary Delete environment group
     * @throws FetchError<400, types.DeleteEnvGroupResponse400> The request could not be understood by the server.
     * @throws FetchError<401, types.DeleteEnvGroupResponse401> Authorization information is missing or invalid.
     * @throws FetchError<404, types.DeleteEnvGroupResponse404> Unable to find the requested resource.
     * @throws FetchError<429, types.DeleteEnvGroupResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.DeleteEnvGroupResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.DeleteEnvGroupResponse503> Server currently unavailable.
     */
    deleteEnvGroup(metadata: types.DeleteEnvGroupMetadataParam): Promise<FetchResponse<number, unknown>>;
    /**
     * Link a particular service to a particular environment group.
     *
     * The linked service will have access to the environment variables and secret files in the
     * group.
     *
     * @summary Link service
     * @throws FetchError<400, types.LinkServiceToEnvGroupResponse400> The request could not be understood by the server.
     * @throws FetchError<401, types.LinkServiceToEnvGroupResponse401> Authorization information is missing or invalid.
     * @throws FetchError<404, types.LinkServiceToEnvGroupResponse404> Unable to find the requested resource.
     * @throws FetchError<429, types.LinkServiceToEnvGroupResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.LinkServiceToEnvGroupResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.LinkServiceToEnvGroupResponse503> Server currently unavailable.
     */
    linkServiceToEnvGroup(metadata: types.LinkServiceToEnvGroupMetadataParam): Promise<FetchResponse<200, types.LinkServiceToEnvGroupResponse200>>;
    /**
     * Unlink a particular service from a particular environment group.
     *
     * The service will lose access to the environment variables and secret files in the group.
     *
     * @summary Unlink service
     * @throws FetchError<400, types.UnlinkServiceFromEnvGroupResponse400> The request could not be understood by the server.
     * @throws FetchError<401, types.UnlinkServiceFromEnvGroupResponse401> Authorization information is missing or invalid.
     * @throws FetchError<404, types.UnlinkServiceFromEnvGroupResponse404> Unable to find the requested resource.
     * @throws FetchError<429, types.UnlinkServiceFromEnvGroupResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.UnlinkServiceFromEnvGroupResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.UnlinkServiceFromEnvGroupResponse503> Server currently unavailable.
     */
    unlinkServiceFromEnvGroup(metadata: types.UnlinkServiceFromEnvGroupMetadataParam): Promise<FetchResponse<number, unknown>>;
    /**
     * Retrieve a particular environment variable in a particular environment group.
     *
     * @summary Retrieve environment variable
     * @throws FetchError<400, types.RetrieveEnvGroupEnvVarResponse400> The request could not be understood by the server.
     * @throws FetchError<401, types.RetrieveEnvGroupEnvVarResponse401> Authorization information is missing or invalid.
     * @throws FetchError<404, types.RetrieveEnvGroupEnvVarResponse404> Unable to find the requested resource.
     * @throws FetchError<429, types.RetrieveEnvGroupEnvVarResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.RetrieveEnvGroupEnvVarResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.RetrieveEnvGroupEnvVarResponse503> Server currently unavailable.
     */
    retrieveEnvGroupEnvVar(metadata: types.RetrieveEnvGroupEnvVarMetadataParam): Promise<FetchResponse<200, types.RetrieveEnvGroupEnvVarResponse200>>;
    /**
     * Add or update a particular environment variable in a particular environment group.
     *
     * @summary Add or update environment variable
     * @throws FetchError<400, types.UpdateEnvGroupEnvVarResponse400> The request could not be understood by the server.
     * @throws FetchError<401, types.UpdateEnvGroupEnvVarResponse401> Authorization information is missing or invalid.
     * @throws FetchError<404, types.UpdateEnvGroupEnvVarResponse404> Unable to find the requested resource.
     * @throws FetchError<429, types.UpdateEnvGroupEnvVarResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.UpdateEnvGroupEnvVarResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.UpdateEnvGroupEnvVarResponse503> Server currently unavailable.
     */
    updateEnvGroupEnvVar(body: types.UpdateEnvGroupEnvVarBodyParam, metadata: types.UpdateEnvGroupEnvVarMetadataParam): Promise<FetchResponse<200, types.UpdateEnvGroupEnvVarResponse200>>;
    /**
     * Remove a particular environment variable from a particular environment group.
     *
     * @summary Remove environment variable
     * @throws FetchError<400, types.DeleteEnvGroupEnvVarResponse400> The request could not be understood by the server.
     * @throws FetchError<401, types.DeleteEnvGroupEnvVarResponse401> Authorization information is missing or invalid.
     * @throws FetchError<404, types.DeleteEnvGroupEnvVarResponse404> Unable to find the requested resource.
     * @throws FetchError<429, types.DeleteEnvGroupEnvVarResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.DeleteEnvGroupEnvVarResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.DeleteEnvGroupEnvVarResponse503> Server currently unavailable.
     */
    deleteEnvGroupEnvVar(metadata: types.DeleteEnvGroupEnvVarMetadataParam): Promise<FetchResponse<number, unknown>>;
    /**
     * Retrieve a particular secret file in a particular environment group.
     *
     * @summary Retrieve secret file
     * @throws FetchError<400, types.RetrieveEnvGroupSecretFileResponse400> The request could not be understood by the server.
     * @throws FetchError<401, types.RetrieveEnvGroupSecretFileResponse401> Authorization information is missing or invalid.
     * @throws FetchError<404, types.RetrieveEnvGroupSecretFileResponse404> Unable to find the requested resource.
     * @throws FetchError<429, types.RetrieveEnvGroupSecretFileResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.RetrieveEnvGroupSecretFileResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.RetrieveEnvGroupSecretFileResponse503> Server currently unavailable.
     */
    retrieveEnvGroupSecretFile(metadata: types.RetrieveEnvGroupSecretFileMetadataParam): Promise<FetchResponse<200, types.RetrieveEnvGroupSecretFileResponse200>>;
    /**
     * Add or update a particular secret file in an particular environment group.
     *
     * @summary Add or update secret file
     * @throws FetchError<400, types.UpdateEnvGroupSecretFileResponse400> The request could not be understood by the server.
     * @throws FetchError<401, types.UpdateEnvGroupSecretFileResponse401> Authorization information is missing or invalid.
     * @throws FetchError<404, types.UpdateEnvGroupSecretFileResponse404> Unable to find the requested resource.
     * @throws FetchError<429, types.UpdateEnvGroupSecretFileResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.UpdateEnvGroupSecretFileResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.UpdateEnvGroupSecretFileResponse503> Server currently unavailable.
     */
    updateEnvGroupSecretFile(body: types.UpdateEnvGroupSecretFileBodyParam, metadata: types.UpdateEnvGroupSecretFileMetadataParam): Promise<FetchResponse<200, types.UpdateEnvGroupSecretFileResponse200>>;
    /**
     * Remove a particular secret file from a particular environment group.
     *
     * @summary Remove secret file
     * @throws FetchError<400, types.DeleteEnvGroupSecretFileResponse400> The request could not be understood by the server.
     * @throws FetchError<401, types.DeleteEnvGroupSecretFileResponse401> Authorization information is missing or invalid.
     * @throws FetchError<404, types.DeleteEnvGroupSecretFileResponse404> Unable to find the requested resource.
     * @throws FetchError<429, types.DeleteEnvGroupSecretFileResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.DeleteEnvGroupSecretFileResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.DeleteEnvGroupSecretFileResponse503> Server currently unavailable.
     */
    deleteEnvGroupSecretFile(metadata: types.DeleteEnvGroupSecretFileMetadataParam): Promise<FetchResponse<number, unknown>>;
    /**
     * List scheduled and/or recent maintenance runs for specified resources.
     *
     * @summary List maintenance runs
     * @throws FetchError<400, types.ListMaintenanceResponse400> The request could not be understood by the server.
     * @throws FetchError<401, types.ListMaintenanceResponse401> Authorization information is missing or invalid.
     * @throws FetchError<404, types.ListMaintenanceResponse404> Unable to find the requested resource.
     * @throws FetchError<429, types.ListMaintenanceResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.ListMaintenanceResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.ListMaintenanceResponse503> Server currently unavailable.
     */
    listMaintenance(metadata?: types.ListMaintenanceMetadataParam): Promise<FetchResponse<200, types.ListMaintenanceResponse200>>;
    /**
     * Retrieve the maintenance run with the provided ID.
     *
     * @summary Retrieve maintenance run
     * @throws FetchError<400, types.RetrieveMaintenanceResponse400> The request could not be understood by the server.
     * @throws FetchError<401, types.RetrieveMaintenanceResponse401> Authorization information is missing or invalid.
     * @throws FetchError<404, types.RetrieveMaintenanceResponse404> Unable to find the requested resource.
     * @throws FetchError<429, types.RetrieveMaintenanceResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.RetrieveMaintenanceResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.RetrieveMaintenanceResponse503> Server currently unavailable.
     */
    retrieveMaintenance(metadata: types.RetrieveMaintenanceMetadataParam): Promise<FetchResponse<200, types.RetrieveMaintenanceResponse200>>;
    /**
     * Update the maintenance run with the provided ID.
     *
     * Updates from this endpoint are asynchronous. To check your update's status, use the
     * [Retrieve maintenance run](https://api-docs.render.com/reference/retrieve-maintenance)
     * endpoint.
     *
     * @summary Update maintenance run
     * @throws FetchError<400, types.UpdateMaintenanceResponse400> The request could not be understood by the server.
     * @throws FetchError<401, types.UpdateMaintenanceResponse401> Authorization information is missing or invalid.
     * @throws FetchError<404, types.UpdateMaintenanceResponse404> Unable to find the requested resource.
     * @throws FetchError<429, types.UpdateMaintenanceResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.UpdateMaintenanceResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.UpdateMaintenanceResponse503> Server currently unavailable.
     */
    updateMaintenance(body: types.UpdateMaintenanceBodyParam, metadata: types.UpdateMaintenanceMetadataParam): Promise<FetchResponse<number, unknown>>;
    /**
     * Trigger the scheduled maintenance run with the provided ID.
     *
     * Triggering maintenance is asynchronous. To check whether maintenance has started, use
     * the [Retrieve maintenance
     * run](https://api-docs.render.com/reference/retrieve-maintenance) endpoint.
     *
     * As maintenance progresses, the run's `state` will change from `scheduled` to other
     * values, such as `in_progress` and `succeeded`.
     *
     * @summary Trigger maintenance run
     * @throws FetchError<400, types.TriggerMaintenanceResponse400> The request could not be understood by the server.
     * @throws FetchError<401, types.TriggerMaintenanceResponse401> Authorization information is missing or invalid.
     * @throws FetchError<404, types.TriggerMaintenanceResponse404> Unable to find the requested resource.
     * @throws FetchError<429, types.TriggerMaintenanceResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.TriggerMaintenanceResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.TriggerMaintenanceResponse503> Server currently unavailable.
     */
    triggerMaintenance(metadata: types.TriggerMaintenanceMetadataParam): Promise<FetchResponse<number, unknown>>;
    /**
     * Create a new webhook.
     *
     * @summary Create a webhook
     * @throws FetchError<400, types.CreateWebhookResponse400> The request could not be understood by the server.
     * @throws FetchError<401, types.CreateWebhookResponse401> Authorization information is missing or invalid.
     * @throws FetchError<404, types.CreateWebhookResponse404> Unable to find the requested resource.
     * @throws FetchError<429, types.CreateWebhookResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.CreateWebhookResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.CreateWebhookResponse503> Server currently unavailable.
     */
    createWebhook(body: types.CreateWebhookBodyParam): Promise<FetchResponse<201, types.CreateWebhookResponse201>>;
    /**
     * List webhooks
     *
     * @summary List webhooks
     * @throws FetchError<400, types.ListWebhooksResponse400> The request could not be understood by the server.
     * @throws FetchError<401, types.ListWebhooksResponse401> Authorization information is missing or invalid.
     * @throws FetchError<404, types.ListWebhooksResponse404> Unable to find the requested resource.
     * @throws FetchError<429, types.ListWebhooksResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.ListWebhooksResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.ListWebhooksResponse503> Server currently unavailable.
     */
    listWebhooks(metadata?: types.ListWebhooksMetadataParam): Promise<FetchResponse<200, types.ListWebhooksResponse200>>;
    /**
     * Retrieve the webhook with the provided ID
     *
     * @summary Retrieve a webhook
     * @throws FetchError<401, types.RetrieveWebhookResponse401> Authorization information is missing or invalid.
     * @throws FetchError<404, types.RetrieveWebhookResponse404> Unable to find the requested resource.
     * @throws FetchError<429, types.RetrieveWebhookResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.RetrieveWebhookResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.RetrieveWebhookResponse503> Server currently unavailable.
     */
    retrieveWebhook(metadata: types.RetrieveWebhookMetadataParam): Promise<FetchResponse<200, types.RetrieveWebhookResponse200>>;
    /**
     * Update the webhook with the provided ID.
     *
     * @summary Update a webhook
     * @throws FetchError<400, types.UpdateWebhookResponse400> The request could not be understood by the server.
     * @throws FetchError<401, types.UpdateWebhookResponse401> Authorization information is missing or invalid.
     * @throws FetchError<404, types.UpdateWebhookResponse404> Unable to find the requested resource.
     * @throws FetchError<429, types.UpdateWebhookResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.UpdateWebhookResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.UpdateWebhookResponse503> Server currently unavailable.
     */
    updateWebhook(body: types.UpdateWebhookBodyParam, metadata: types.UpdateWebhookMetadataParam): Promise<FetchResponse<200, types.UpdateWebhookResponse200>>;
    /**
     * Delete the webhook with the provided ID.
     *
     * @summary Delete a webhook
     * @throws FetchError<401, types.DeleteWebhookResponse401> Authorization information is missing or invalid.
     * @throws FetchError<404, types.DeleteWebhookResponse404> Unable to find the requested resource.
     * @throws FetchError<429, types.DeleteWebhookResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.DeleteWebhookResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.DeleteWebhookResponse503> Server currently unavailable.
     */
    deleteWebhook(metadata: types.DeleteWebhookMetadataParam): Promise<FetchResponse<number, unknown>>;
    /**
     * Retrieve a list of events that have been sent to this webhook, with optional filtering
     * by timestamp.
     *
     * @summary List webhook events
     * @throws FetchError<400, types.ListWebhookEventsResponse400> The request could not be understood by the server.
     * @throws FetchError<401, types.ListWebhookEventsResponse401> Authorization information is missing or invalid.
     * @throws FetchError<404, types.ListWebhookEventsResponse404> Unable to find the requested resource.
     * @throws FetchError<429, types.ListWebhookEventsResponse429> Rate limit has been surpassed.
     * @throws FetchError<500, types.ListWebhookEventsResponse500> An unexpected server error has occurred.
     * @throws FetchError<503, types.ListWebhookEventsResponse503> Server currently unavailable.
     */
    listWebhookEvents(metadata: types.ListWebhookEventsMetadataParam): Promise<FetchResponse<200, types.ListWebhookEventsResponse200>>;
}
declare const createSDK: SDK;
export = createSDK;
