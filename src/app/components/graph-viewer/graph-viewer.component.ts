import { Component, OnInit, inject } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";


function isValid(component: string, regex: RegExp): boolean {
  return regex.test(component);
}


@Component({
  selector: 'app-graph-viewer',
  templateUrl: './graph-viewer.component.html',
  styleUrls: ['./graph-viewer.component.scss']
})
export class GraphViewerComponent implements OnInit {
  route = inject(ActivatedRoute);
  router = inject(Router);

  error = '';
  owner = '';
  repo = '';
  ref = '';
  filename = '';

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      const owner = params['owner'];
      const repo = params['repo'];
      const ref = params['ref'];
      const filename = params['filename'];

      if (isValid(owner, /^[a-zA-Z0-9][a-zA-Z0-9-_]+$/) &&
        isValid(repo, /^[a-zA-Z0-9][a-zA-Z0-9-_]+$/) &&
        isValid(ref, /^[^\s./][a-zA-Z0-9-_/]+[^/]$/) &&
        isValid(filename, /^[a-zA-Z0-9-_./]+$/)) {
        this.owner = owner;
        this.repo = repo;
        this.ref = ref;
        this.filename = filename;
        this.error = '';
      } else {
        this.error = 'invalid graph url';
        void this.router.navigate(['/404'], { skipLocationChange: true });
      }
    });
  }

  getGraphUrl(): string {
    if (this.error || !this.owner || !this.repo || !this.ref || !this.filename) {
      return "http://about:blank";
    }
    return `https://app.actionforge.dev/github/${this.owner}/${this.repo}/${this.ref}/.github/workflows/graphs/${this.filename}`;
  }
}
