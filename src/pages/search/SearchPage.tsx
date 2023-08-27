import React, { useEffect, useRef, useState } from "react";
import { FiSearch } from "react-icons/fi";
import useSearch from "../../hook/useSearch";
import Skeleton from "../../components/Skeleton";
import { useNavigate } from "react-router-dom";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import {
  SearchPageBlock,
  InputContainer,
  ImageWrapper,
  Overview,
  TitleContainer,
  R9dCrew,
  SearchMoreBtn,
} from "./SearchPage.style";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/config/ConfigStore";
import { CrewList } from "../../redux/modules/Modules";
import secureLocalStorage from "react-secure-storage";
import Scrap from "../../components/scrap/Scrap";

const SearchPage = () => {
  const access = secureLocalStorage.getItem("Access");
  const refresh = secureLocalStorage.getItem("Refresh");
  const searchResult = useSelector((state: RootState) => state.searchResults);
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState({ value: 0, searchCalled: false });

  const [toprev, setToprev] = useState(false);
  const [updatedSearchResult, setUpdatedSearchResult] = useState<CrewList[]>(
    []
  );

  const searchInputRef = useRef<HTMLInputElement>(null);

  // useSearch : 결과, 로딩, 에러 등을 반환 : 키워드, 페이지, 사이즈, 결과리셋 가져감
  const {
    loading,
    error,
    hasMore,
    search,
  }: {
    loading: boolean;
    error: any;
    hasMore: boolean;
    search: (
      keyword: string,
      page: number,
      resetResults: boolean,
      toprev: boolean
    ) => Promise<void>;
  } = useSearch();

  // 페이지, 키원드, 서치가 변환될 때마다 실행
  useEffect(() => {
    // 페이지가 1보가 크고 searchCalled가 false일때 서치를 실행하고 searchCalled를 true로 바꿔 준다.
    if (page.value >= 1 && page.searchCalled && page.value !== 0) {
      setPage((prevState) => ({ ...prevState, searchCalled: false }));
      search(keyword, page.value, false, toprev);
    }
  }, [page, keyword, search]);

  // 서치결과가 변화 될 때마다 실행
  useEffect(() => {
    //searchResult의 길이가 0보다 클때 updatedSearchReuslt를 10개씩 보여준다.
    if (searchResult.length > 0) {
      let newSearchResult = searchResult.slice(-10);
      newSearchResult.sort((a: any, b: any) => a.page - b.page);
      setUpdatedSearchResult(newSearchResult);
    }
  }, [searchResult]);

  const onChangeKeyword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };

  // 서치버튼 클릭함수
  const onClickSearch = async () => {
    // console.log("click");
    if (keyword !== "" && searchResult.length === 0) {
      setUpdatedSearchResult([]);
      await search(keyword, (page.value = 1), false, false);
    } else if (keyword !== "" && searchResult.length > 0) {
      setUpdatedSearchResult([]);
      await search(keyword, (page.value = 1), true, false);
    } else {
      searchInputRef.current?.focus();
    }
  };

  const moreBtnHandler = () => {
    if (hasMore) {
      setPage((prevPageState) => ({
        value: prevPageState.value + 1,
        searchCalled: true,
      }));
      setToprev(false);
    }
    // console.log("MORE!!");
  };

  const prevBtnHandler = () => {
    if (page.value > 2 && !hasMore) {
      setPage((prevPageState) => ({
        value: prevPageState.value - 3,
        searchCalled: true,
      }));
    } else if (updatedSearchResult.length === 10 && page.value > 2 && hasMore) {
      setPage((prevPageState) => ({
        value: prevPageState.value - 2,
        searchCalled: true,
      }));
      setToprev(true);
    } else {
      setPage((prevPageState) => ({
        value: prevPageState.value - 1,
        searchCalled: true,
      }));
      setToprev(true);
    }
  };

  const onClickCrew = (itemId: number) => {
    if (access && refresh !== "") {
      navigate(`/crew/${itemId}`);
    } else {
      navigate("/login");
    }
  };

  // console.log("page", page);
  // console.log("updatedSearchResult", updatedSearchResult);
  // console.log("searchResult", searchResult);
  // console.log("loading", loading, "error", error);
  return (
    <SearchPageBlock>
      <InputContainer>
        <input
          type="text"
          value={keyword}
          onChange={onChangeKeyword}
          ref={searchInputRef}
          placeholder="찾고 싶은 크루를 검색해보세요."
        />
        <button onClick={onClickSearch}>
          <FiSearch />
        </button>
      </InputContainer>

      {page.value > 1 && (
        <SearchMoreBtn onClick={prevBtnHandler}>
          <IoIosArrowUp
            style={{ width: "30px", height: "30px", color: "grey" }}
          />
        </SearchMoreBtn>
      )}
      {updatedSearchResult.length > 0 &&
        updatedSearchResult.map((post: CrewList) => {
          return (
            <R9dCrew
              key={post.crewRecruitmentId}
              onClick={() => onClickCrew(post.crewRecruitmentId)}
            >
              <ImageWrapper>
                <img
                  src={post.image && post.image[0] ? post.image[0] : ""}
                  alt=""
                />
              </ImageWrapper>

              <Overview>
                <div>
                  <TitleContainer>
                    <p>{post.title}</p>
                  </TitleContainer>

                  <Scrap />
                </div>

                <p>{post.exerciseKind}</p>
              </Overview>
            </R9dCrew>
          );
        })}

      {loading ? <Skeleton /> : ""}
      {error ? <h3 style={{ color: "red" }}>결과가 없습니다</h3> : ""}
      {updatedSearchResult.length > 0 && hasMore && (
        <SearchMoreBtn onClick={moreBtnHandler}>
          <IoIosArrowDown
            style={{ width: "30px", height: "30px", color: "grey" }}
          />
        </SearchMoreBtn>
      )}
    </SearchPageBlock>
  );
};
export default SearchPage;