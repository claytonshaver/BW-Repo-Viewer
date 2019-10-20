import React, {useState} from 'react';
import styled from 'styled-components';
import Star from '../icons/Star';
import Fork from '../icons/Fork';
import Link from '../icons/Link';
import Commit from '../icons/Commit';
import Back from '../icons/Back';

const CardWrapper = styled.div`
  height: 200px;
  max-width: 200px;
  margin: 15px;
  flex: 1;
  flex-basis: 200px;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Title = styled.div`
  height: 30px;
  font-weight: 700;
  color: #ea4c89;
  font-size: 1.2rem;
`;

const OwnerIcon = styled.img`
  width: 50%;
  height: 50%;
`;

const StatsRow = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: center;
  align-items: center;
  height: 25%;
`;

const StatIcon = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 0px 5px;
`;

const Highlight = styled.div`
  color: #ea4c89;
  font-wieght: 700;
`;

const HeadRow = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const Button = styled.div`
  cursor: pointer;
  margin: 0px 10px;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
`;

const CommitsWrapper = styled.div`
  height: 80%;
  width: 100%;
  overflow-y: scroll;
  diplay: flex;
  flex-direction: column;
  padding: 5px;
`;

const CommitRow = styled.div`
  width: 100%;
  font-size: 0.8rem;
  display: flex;
  flex-direction: column;
`;

const CommitHeader = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
`;

const CommitAuthor = styled.div`
  color: #ea4c89;
  margin-right: 5px;
`;

const CommitMessage = styled.div`
  text-overflow: ellipsis;
  margin-left: 5px;
`;

const Card = ({name, html_url, stargazers_count, img_url, forks_count, commits_url, handleRepoQuery, commits = {}}) => {
  const [showCommits, setShowCommits] = useState(false);

  const handleCommitsClick = () => {
    setShowCommits(true);
    handleRepoQuery(commits_url);
  };

  const handleBackClick = () => setShowCommits(false);

  const InfoView = (
    <React.Fragment>
      <Title>{name}</Title>
      <OwnerIcon src={img_url} />
      <StatsRow>
        <StatIcon>
          <Highlight>{stargazers_count}</Highlight>
          <div>
            <Star />
            Stars
          </div>
        </StatIcon>
        <StatIcon>
          <Highlight>{forks_count}</Highlight>
          <div>
            <Fork />
            Forks
          </div>
        </StatIcon>
      </StatsRow>
    </React.Fragment>
  );

  const ButtonRow = !showCommits ? (
    <HeadRow>
      {' '}
      <Button onClick={handleCommitsClick}>
        <Commit />
        Commits
      </Button>
      <Button onClick={() => window.location.replace(html_url)}>
        <Link />
      </Button>
    </HeadRow>
  ) : (
    <HeadRow>
      <Button onClick={handleBackClick}>
        <Back /> Back
      </Button>
    </HeadRow>
  );

  const Commits = (
    <CommitsWrapper>
      {Object.keys(commits).map(key => {
        const {message, author_name, date, id} = commits[key];
        return (
          <CommitRow key={id}>
            <CommitHeader>
              <CommitAuthor>{author_name}</CommitAuthor> ({date.slice(-9, -1)})
            </CommitHeader>
            <CommitMessage>{message}</CommitMessage>
          </CommitRow>
        );
      })}
    </CommitsWrapper>
  );

  return (
    <CardWrapper>
      {ButtonRow}
      {showCommits ? Commits : InfoView}
    </CardWrapper>
  );
};

export default Card;
