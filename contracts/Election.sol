pragma solidity >= 0.4.21 < 0.6.0;
// 스마트 컨트랙트는 솔리디티 버전을 선언하는 구문으로 시작해야 함

contract Election {
    // contract 키워드로 계약 이름 정의

    string public candidate;
    // candidate 이름을 저장할 string 변수 정의
    // 이 때, public으로 설정하면 솔리디티가 해당 변수 내용을 조회할 수 있는 getter 함수를 제공해 줌

        struct Candidate {
        uint id; // unsigned unteger type
        string name;
        uint voteCount;
    }

    mapping(uint => Candidate) public candidates;
    // key-value로 mapping

    uint public candidatesCount;

    constructor() public {
        addCandidate("Candidate 1");
        addCandidate("Candidate 2");
    }

    function addCandidate (string memory _name) private {
        // 후보자 추가하는 함수
        candidatesCount ++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
        // candidatesCount를 id로 새로운 Candidate struct 할당
        // name은 파라미터로 받은 값, vote count는 초기값으로 0을 줌
    }

    mapping(address => bool) public voters;

function vote (uint _candidateId) public {
    
    require(!voters[msg.sender], "This Voter has already voted!");
		// 투표는 한 번만 가능

    require(_candidateId > 0 && _candidateId <= candidatesCount, "There is no such candidate");
		// 유효한 후보자에게 투표해야 함

    voters[msg.sender] = true;
		// 유권자가 투표했다는 기록

    candidates[_candidateId].voteCount ++;
		// 후보 득표수 업데이트

    }
       
}