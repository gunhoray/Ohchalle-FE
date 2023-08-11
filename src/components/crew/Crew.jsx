import { useState } from 'react';
import {
  CrewBlock,
  InputContainer,
  CategoryContainer,
  CrewListContainer,
  CrewListTitle } from './Crew.style';
import { getCrews } from '../../api/CrewApi';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import 'swiper/css';
import LatestCrewList from '../common/LatestCrewList';
import R9dCrewList from '../common/R9dCrewList';
import PopularCrewList from '../common/PopularCrewList';

function Crew() {
  const navigate = useNavigate();
  const categories = [
    '전체', '러닝', '웨이트', '자전거', '요가', '필라테스', '크로스핏', '골프', '테니스'
  ];
  const [keyword, setKeyword] = useState('');

  const onChangeKeyword = (e) => {
    setKeyword(e.target.value);
  }

  const onClickSearch = () => {
    console.log('keyword: ', keyword);
  }

  const onClickCategory = (category) => {
    console.log('category: ', category);
  }

  const onClickCrew = (itemId) => {
    navigate(`/crew/${itemId}`);
  }

  const {
    data,
    isLoading,
    error
  } = useQuery(['crews'], getCrews);

  return (
    <CrewBlock>
      { isLoading && 'Loading...' }
      { error && 'An error has occurred: ' + error.message }
      <InputContainer>
        <input
          type='text'
          value={keyword}
          onChange={onChangeKeyword}
        />
        <button
          onClick={onClickSearch}
        ><FiSearch /></button>
      </InputContainer>

      <CategoryContainer>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onClickCategory(category)}
          >{category}</button>
        ))}
      </CategoryContainer>

      <CrewListContainer>
        <CrewListTitle>
          최신 크루 리스트
        </CrewListTitle>
        
        <LatestCrewList
          data={data}
          onClickCrew={onClickCrew}
        />
      </CrewListContainer>

      <CrewListContainer>
        <CrewListTitle>
          인기 크루 리스트
        </CrewListTitle>

        <PopularCrewList
          data={data}
          onClickCrew={onClickCrew}
        />
      </CrewListContainer>

      <CrewListContainer>
        <CrewListTitle>
          추천 크루 리스트
        </CrewListTitle>
        
        <R9dCrewList
          data={data}
          onClickCrew={onClickCrew}
        />
      </CrewListContainer>
    </CrewBlock>
  )
}

export default Crew;