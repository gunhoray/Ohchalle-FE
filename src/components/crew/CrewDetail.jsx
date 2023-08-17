import {
  ImageWrapper,
  CrewDetailBlock,
  Header,
  MapWrapper,
  ButtonWrapper } from './CrewDetail.style';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getCrew } from "../../api/CrewApi";
import { Map, MapMarker } from 'react-kakao-maps-sdk';
import { useEffect, useState } from 'react';

function CrewDetail() {
  const { kakao } = window;
  const [ coordinate, setCoordinate ] = useState({ lat: 33.55635, lng: 126.795841 });

  const params = useParams();
  const {
    data: crew,
    isLoading,
    error,
  } = useQuery(["crew", params.id], () => getCrew(params.id));

  useEffect(() => {
    const geocoder = new kakao.maps.services.Geocoder();
    const address = crew?.data.location ?? '제주특별자치도 제주시 첨단로 242';

    geocoder.addressSearch(address, function(result, status) {
      if (status === kakao.maps.services.Status.OK) {
        const coords = new kakao.maps.LatLng(result[0].y, result[0].x);
  
        // console.log(coords);
  
        setCoordinate((prevState) => {
          return {
            ...prevState,
            lat: coords.getLat(),
            lng: coords.getLng()
          }
        });
      }
    });
  }, [crew?.data.location, kakao.maps.LatLng, kakao.maps.services.Geocoder, kakao.maps.services.Status.OK]);

  useEffect(() => {
    console.log(coordinate);
  }, [coordinate]);

  return (
    <CrewDetailBlock>
      {isLoading && "Loading..."}
      {error && "An error has occurred: " + error.message}

      <ImageWrapper>
        <img
          src={
            crew?.data.images?.length !== 0 && crew?.data.images?.length !== undefined
              ? crew?.data.images[0]
              : ''
          }
          alt=''
        />
      </ImageWrapper>

      <Header>
        <div>
          <p>일정 |</p>
          <div>{crew?.data.exerciseDate}</div>
        </div>

        <div>
          <p>인원 |</p>
          <div>{crew?.data.totalNumber}</div>
        </div>

        <div>
          <p>장소 |</p>
          <div>{crew?.data.location}</div>
        </div>

        <div>
          <p>내용 |</p>
          <div>{crew?.data.content}</div>
        </div>
      </Header>

      <MapWrapper>
        <Map
          center={coordinate}
          style={{ width: '100%', height: '100%' }}
        >
          <MapMarker position={coordinate} />
        </Map>
      </MapWrapper>

      <ButtonWrapper>
        <button>크루 참여하기</button>
      </ButtonWrapper>
    </CrewDetailBlock>
  );
};

export default CrewDetail;