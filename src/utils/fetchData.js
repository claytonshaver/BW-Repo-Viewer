import {pick, compose, map, indexBy, prop, assoc, pathOr, replace, concat, objOf, __} from 'ramda';
import moment from 'moment';

const repoKeys = ['stargazers_count', 'name', 'html_url', 'id', 'forks_count', 'img_url', 'commits_url'];
const commitKeys = ['date', 'author_name', 'id', 'message'];

const normalizeRepos = compose(
  indexBy(prop('id')),
  map(pick(repoKeys)),
  map(n => assoc('img_url', pathOr('', ['owner', 'avatar_url'], n), n)),
  prop('items')
);

const normalizeCommits = repoId =>
  compose(
    objOf(repoId),
    indexBy(prop('id')),
    map(pick(commitKeys)),
    map(n => assoc('id', pathOr('', ['node_id'], n), n)),
    map(n => assoc('message', pathOr('', ['commit', 'message'], n), n)),
    map(n => assoc('date', pathOr('', ['commit', 'author', 'date'], n), n)),
    map(n => assoc('author_name', pathOr('', ['commit', 'author', 'name'], n), n))
  );

const fetchData = (url, normalizer, successCallback, errorCallback) =>
  fetch(url)
    .then(response => {
      if (response.status >= 400) {
        throw new Error('Error fetching from github');
      }
      return response.json();
    })
    .then(data => {
      successCallback(normalizer(data));
    })
    .catch(error => {
      errorCallback(error.message);
    });

const fetchRepos = (successCallback, errorCallback) =>
  fetchData(
    'https://api.github.com/search/repositories?q=stars:>=1&sort=stars&per_page=100',
    normalizeRepos,
    successCallback,
    errorCallback
  );

const fetchCommitsForRepo = (url, successCallback, errorCallback) => {
  const normalizedUrl = compose(
    concat(
      __,
      moment()
        .subtract(1, 'day')
        .format('YYYY-MM-DDTHH:MM:SS')
    ),
    concat(__, '?since='),
    replace('{/sha}', '')
  )(url);
  fetchData(normalizedUrl, normalizeCommits(url), successCallback, errorCallback);
};

export {normalizeRepos, normalizeCommits, fetchRepos, fetchCommitsForRepo};
