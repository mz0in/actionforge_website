import { Injectable, inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import { JsonService } from './json.service';
import { Configuration, FrontendApi } from '@ory/client';
import { IWhoAmI } from '../schemas/whoami';
import { YamlService } from './yaml.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { NotificationService } from './notification.service';
import { HttpErrorResponse } from '@angular/common/http';
import { IGithubBranch, IGithubFile, IGithubRepo, IGithubTag, IGithubUser } from '../schemas/github';

export const frontend = new FrontendApi(
    new Configuration({
        basePath: environment.kratosPublicApiUrl,
        baseOptions: {
            withCredentials: true,
        },
    }),
)

export enum GithubInstallationStatus {
    None = "",
    NotInstalled = "not-installed",
    Installed = "installed",
    BadCredentials = "bad-credentials",
    UnknownError = "unknown-error"
}

export interface IGithubQueryResponse {
    data: {
        github: {
            users?: IGithubUser[];
            orgs?: IGithubUser[];
            repo?: IGithubRepo;
            repos?: IGithubRepo[];
            files?: IGithubFile[];
            tags?: IGithubTag[];
            branches?: IGithubBranch[];
        }
    }
}

@Injectable({
    providedIn: 'root'
})
export class GatewayService {
    ns = inject(NotificationService)
    jsonService = inject(JsonService)
    yamlService = inject(YamlService)

    whoami = new BehaviorSubject<IWhoAmI | null>(null);

    // ------------------------------------------------------------
    // Github
    // ------------------------------------------------------------

    async ghOauthInstallCheck(): Promise<GithubInstallationStatus> {
        try {
            interface IResponse {
                installed: GithubInstallationStatus
            }
            const response = await this.jsonService.httpGet<IResponse>(`${environment.gatewayUrl}/api/v1/github/app/install-check`, {
                withCredentials: true
            })
            return response.installed;
        } catch (error) {
            return GithubInstallationStatus.UnknownError;
        }
    }

    async ghOauthInstall(): Promise<void> {
        // set 'origin' in order for the user to be redirected back to that page
        document.location.href = `${environment.gatewayUrl}/api/v1/github/app/install?origin=${document.location.href}`;
    }

    async ghQuery(opts: {
        users?: { users: string[] },
        repo?: { owner: string, repo: string },
        repos?: { owner: string, affiliation: string },
        files?: { owner: string, repo: string, ref: string, path: string }
        orgs?: IGithubUser[],
        branches?: { owner: string, repo: string },
        tags?: { owner: string, name: string },
    }): Promise<IGithubQueryResponse> {
        try {
            const users = `users(users: [${opts.users?.users.map(u => `"${u}"`)?.join(", ")}]) { id name avatar_url is_me }`;
            const orgs = `orgs { id name avatar_url is_me }`;
            const repo = `repo(owner: "${opts.repo?.owner}", repo: "${opts.repo?.repo}") { id name fullname owner description homepage default_branch master_branch private created_at pushed_at language topics license { key name url } html_url forks_count stargazers_count }`;
            const repos = `repos(owner: "${opts.repos?.owner}", affiliation: "${opts.repos?.affiliation}") { id name fullname owner description homepage default_branch master_branch private created_at pushed_at language topics license { key name url } html_url forks_count stargazers_count }`;
            const tags = `tags(owner: "${opts.tags?.owner}", repo: "${opts.tags?.name}") { sha author { date name email } committer { date name email } message }`;
            const branches = `branches(owner: "${opts.branches?.owner}", repo: "${opts.branches?.repo}") { name commit { sha author { id name avatar_url is_me } committer { id name avatar_url is_me } } }`;
            const files = `files(owner: "${opts.files?.owner}", repo: "${opts.files?.repo}", ref: "${opts.files?.ref}", path: "${opts.files?.path}") { type target encoding size name path }`;

            const res = await this.jsonService.httpPost<IGithubQueryResponse>(`${environment.gatewayUrl}/api/v1/github/query`, {
                query: `
                    {
                        github {
                            ${opts.repo ? repo : ""}
                            ${opts.repos ? repos : ""}
                            ${opts.orgs ? orgs : ""}
                            ${opts.users ? users : ""}
                            ${opts.tags ? tags : ""}
                            ${opts.branches ? branches : ""}
                            ${opts.files ? files : ""}
                        }
                    }`
            }, {
                withCredentials: true,
            })
            return res;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    // ------------------------------------------------------------
    // Authentication
    // ------------------------------------------------------------

    async httpCheckIfUserIsSignedIn(): Promise<IWhoAmI | null> {
        try {
            const whoami = await this.jsonService.httpGet<IWhoAmI>(`${environment.gatewayUrl}/api/v1/user/whoami`, {
                withCredentials: true
            })
            this.whoami.next(whoami);
            return whoami;
        } catch (error) {
            this.whoami.next(null);
            if (error instanceof HttpErrorResponse) {
                if (error.status == 401) {
                    return null;
                }
            } else {
                console.log(error);
            }
            return null;
        }
    }

    async signIn(): Promise<void> {
        window.document.location.href = `${environment.kratosSelfServiceUrl}/login`;
    }

    async signOut(): Promise<boolean> {
        try {
            // Create a "logout flow" in Ory Identities
            const { data: flow } = await frontend.createBrowserLogoutFlow()
            // Use the received token to "update" the flow and thus perform the logout
            await frontend.updateLogoutFlow({
                token: flow.logout_token,
            })
            this.whoami.next(null);
            window.document.location.href = `/`; // send user back to dashboard
            return true;
        } catch (error) {
            // The user could not be logged out
            // This typically happens if the token does not match the session,
            // or is otherwise malformed or missing
            return false;
        }
    }

    whoAmINow(): IWhoAmI | null {
        return this.whoami.value;
    }

    whoAmIObservable(): Observable<IWhoAmI | null> {
        return this.whoami.asObservable();
    }
}