import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import Card from '../components/Card';
import {prop} from 'ramda';

import {fetchRepos, fetchCommitsForRepo} from '../utils/fetchData';

const PageWrapper = styled.div`
  width: 100%;
  height: 100%;
  font-family: helvetica;
`;

const ToolBar = styled.div`
  width: 100%;
  height: 50px;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
  display: flex;
  align-items: center;
  justify-contnet: flex-start;
  padding: 0px 15px;
`;

const Logo = styled.div`
  color: #7049e8;
  font-weight: 700;
  font-size: 1.5rem;
`;

const ReposWrapper = styled.div`
  widht: 100%;
  height 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
`;

const ReposCatalog = () => {
  const [repos, setRepos] = useState([]);
  const [repoQuery, setRepoQuery] = useState('');
  const [commits, setCommits] = useState({});
  const [error, setError] = useState(null);
  const updateCommits = results => setCommits(prevState => Object.assign({}, prevState, results));

  // Fetch repos on load
  useEffect(() => {
    fetchRepos(setRepos, setError);
  }, []);

  // Load commits for a repo
  useEffect(() => {
    repoQuery !== '' && fetchCommitsForRepo(repoQuery, updateCommits, setError);
  }, [repoQuery]);

  const handleRepoClick = url => setRepoQuery(url);

  return (
    <PageWrapper>
      <ToolBar>
        <Logo>Github Repo Viewer</Logo>
      </ToolBar>
      <ReposWrapper>
        {Object.keys(repos).map(key => (
          <Card
            key={repos[key].id}
            handleRepoQuery={handleRepoClick}
            commits={prop(repos[key].commits_url, commits)}
            {...repos[key]}
          />
        ))}
        <div>{error}</div>
      </ReposWrapper>
    </PageWrapper>
  );
};
export default ReposCatalog;
