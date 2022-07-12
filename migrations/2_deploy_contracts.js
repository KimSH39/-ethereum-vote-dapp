// 만들었던 스마트 컨트랙트가(Election.sol) 블록체인에 배포될 수 있는지 확인
// migrations 디렉 아래 파일은 숫자로 넘버링 해야 함 -> 트러플이 인식하기 위해

var Election = artifacts.require('./Election.sol')
// 작성한 계약을 요청해 Election에 할당
// artifacts.require -> 계약 정보를 읽어오는 부분

module.exports = function (deployer) {
  deployer.deploy(Election)
  // deployer 객체는 배포 작업을 준비하기 위한 기본 인터페이스
}
