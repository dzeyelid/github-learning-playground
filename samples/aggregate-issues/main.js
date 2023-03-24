const { Octokit } = require('octokit')
require('dotenv').config()

const aggregateIssues = new Promise(async () => {
  const octokit = new Octokit({ auth: process.env.GITHUB_PAT })

  const owner = process.env.OWNER
  const repoName = process.env.REPO_NAME

  const issues = []

  var issuesCursor = null
  var issuesHasNextPage = true
  const issuesNumberInPage = 2

  const issuesQuery = `
      query (
        $repoName: String!,
        $owner: String!,
        $issueCursor: String,
        $issueNumberInPage: Int!,
        ){
        repository(owner: $owner, name: $repoName) {
          issues(first: $issueNumberInPage, after: $issueCursor) {
            nodes {
              number
              createdAt
              closedAt
            }
            pageInfo {
              endCursor
              hasNextPage
            }
          }
        }
      }
    `

  const timelineItemsQuery = `
        query (
          $repoName: String!,
          $owner: String!,
          $issueNumber: Int!,
          $timelineItemsCursor: String,
          $timelineItemsNumberInPage: Int!,
          ){
          repository(owner: $owner, name: $repoName) {
            issue(number: $issueNumber) {
              number
              timelineItems(
                first: $timelineItemsNumberInPage,
                after: $timelineItemsCursor,
                itemTypes:CROSS_REFERENCED_EVENT
              ) {
                nodes {
                  ... on CrossReferencedEvent {
                    source {
                      ... on PullRequest {
                        number
                        createdAt
                        closedAt
                        merged
                        mergedAt
                      }
                    }
                  }
                }
                pageInfo {
                  endCursor
                  hasNextPage
                }
              }
            }
          }
        }
      `

  while (issuesHasNextPage) {
    const issuesResponse = await octokit.graphql(issuesQuery, {
      owner,
      repoName,
      issueCursor: issuesCursor,
      issueNumberInPage: issuesNumberInPage,
    })

    issuesCursor = issuesResponse.repository.issues.pageInfo.endCursor
    issuesHasNextPage = issuesResponse.repository.issues.pageInfo.hasNextPage

    var timelineItemsCursor = null
    var timelineItemsHasNextPage = true
    const timelineItemsNumberInPage = 2

    const pagedIssues = await Promise.all(issuesResponse.repository.issues.nodes.map(async (issue) => {
      const pullRequests = []

      while (timelineItemsHasNextPage) {
        const issueResponse = await octokit.graphql(timelineItemsQuery, {
          owner,
          repoName,
          issueNumber: issue.number,
          timelineItemsCursor: timelineItemsCursor,
          timelineItemsNumberInPage: timelineItemsNumberInPage,
        })

        timelineItemsCursor = issueResponse.repository.issue.timelineItems.pageInfo.endCursor
        timelineItemsHasNextPage = issueResponse.repository.issue.timelineItems.pageInfo.hasNextPage

        issueResponse.repository.issue.timelineItems.nodes.forEach((timelineItem) => {
          if (timelineItem && timelineItem.source) {
            pullRequests.push({
              number: timelineItem.source.number,
              createdAt: timelineItem.source.createdAt,
              closedAt: timelineItem.source.closedAt,
              merged: timelineItem.source.merged,
              mergedAt: timelineItem.source.mergedAt,
            })
          }
        })
      }

      return {
        issueNumber: issue.number,
        createdAt: issue.createdAt,
        closedAt: issue.closedAt,
        pullRequests,
      }
    }))

    issues.push(...pagedIssues)
  }

  console.log(JSON.stringify(issues))
})

Promise.all([aggregateIssues])
