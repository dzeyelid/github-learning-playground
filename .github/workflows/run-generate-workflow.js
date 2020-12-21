module.exports = async ({github, context}) => {
  const { ref, payload } = context;
  const ownerAndRepoName = payload.repository.full_name.split('/');
  const owner = ownerAndRepoName[0];
  const repo = ownerAndRepoName[1];
  const workflow_id = 'generate.yml';
  const inputs = {
    target_version: process.env.NEXT_VERSION
  };
  const params = {
    owner,
    repo,
    workflow_id,
    ref,
    data: {
      ref,
      inputs,
    }
  };
  console.log(params);
  const res = await github.actions.createWorkflowDispatch(params);
  console.log(res);
  //const res = await github.request("POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches", params);
  const headers = new Headers();
  headers.append('Accept', 'application/vnd.github.v3+json');
  headers.append('Authorization', `token ${process.env.GITHUB_TOKEN}`);
  const request = new Request(
    'https://api.github.com/repos/dzeyelid/github-actions-playground/actions/workflows/generate.yml/dispatches',
    {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({ref, inputs}),
    }
  );
  fetch(request)
    .then((res) => {console.log(res)});
  //const res = await github.request("POST /repos/dzeyelid/github-actions-playground/actions/workflows/generate.yml/dispatches", {
  //  data: {
  //    ref,
  //    inputs,
  //  }
  //});
}