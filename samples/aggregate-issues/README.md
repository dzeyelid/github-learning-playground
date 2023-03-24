
# GitHub の issues と紐づく pull requests を取得するサンプル

GitHub の issues とそれに紐づく pull requests を取得するサンプルです。

- [octokit/octokit.js](https://github.com/octokit/octokit.js) を利用してます
- Node.js
  - v18+ で動作確認しています

## サンプルコードの実行

下記をご参考ください。

```bash
cd samples/aggregate-issues

npm install
node main.js
```

`main.js` はJSON文字列を出力するので、`jq` で整形すると見やすいです。

```bash
# jq で JSON を整形して出力する
node main.js | jq

# JSON を整形してファイル出力する
node main.js | jq > .output.json
```

## 出力フォーマット

このサンプルは、下記のようにオブジェクトを配列で出力します。

```jsonc
[
  {
    // issue number
    "issueNumber": 1,
    // date issue was created
    "createdAt": "2021-05-16T06:09:07Z",
    // date issue was closed
    "closedAt": "2021-05-16T07:57:36Z",
    // associated pull requests
    "pullRequests": [
      {
        // pull request number
        "number": 4,
        // date pull request was created
        "createdAt": "2021-05-16T07:15:37Z",
        // date pull request was closed
        "closedAt": "2021-05-16T07:57:36Z",
        // whether pull request was merged
        "merged": true,
        // date pull request was merged
        "mergedAt": "2021-05-16T07:57:36Z"
      }
    ]
  }
]
```

たとえば、下記のようなデータが出力されます。

```json
[
  {
    "issueNumber": 1,
    "createdAt": "2021-05-16T06:09:07Z",
    "closedAt": "2021-05-16T07:57:36Z",
    "pullRequests": [
      {
        "number": 4,
        "createdAt": "2021-05-16T07:15:37Z",
        "closedAt": "2021-05-16T07:57:36Z",
        "merged": true,
        "mergedAt": "2021-05-16T07:57:36Z"
      }
    ]
  },
  {
    "issueNumber": 2,
    "createdAt": "2021-05-16T08:10:16Z",
    "closedAt": "2021-05-17T11:29:17Z",
    "pullRequests": [
      {
        "number": 5,
        "createdAt": "2021-05-16T12:34:25Z",
        "closedAt": "2021-05-16T12:57:17Z",
        "merged": true,
        "mergedAt": "2021-05-16T12:57:17Z"
      },
      {
        "number": 6,
        "createdAt": "2021-05-16T22:30:27Z",
        "closedAt": "2021-05-16T23:40:15Z",
        "merged": false,
        "mergedAt": null
      }
    ]
  },
  {
    "issueNumber": 3,
    "createdAt": "2021-05-17T10:17:25Z",
    "closedAt": "2021-05-17T10:49:25Z",
    "pullRequests": []
  }
]
```
