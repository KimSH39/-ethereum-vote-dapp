App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',

  init: function () {
    return App.initWeb3()
  },

  initWeb3: function () {
    if (typeof web3 !== 'undefined') {
      // 메타마스크에서 web3 인스턴스를 이미 제공한 경우
      App.web3Provider = web3.currentProvider
      web3 = new Web3(web3.currentProvider)
    } else {
      // web3 인스턴스가 제공되지 않은 경우 기본 인스턴스 지정
      App.web3Provider = new Web3.providers.HttpProvider(
        'http://localhost:7545',
      )
      web3 = new Web3(App.web3Provider)
    }
    return App.initContract()
  },

  initContract: function () {
    $.getJSON('Election.json', function (election) {
      // 배포된 스마트 컨트랙트 인스턴스를 가져옴
      App.contracts.Election = TruffleContract(election)
      // 상호작용 할 수 있도록 연결
      App.contracts.Election.setProvider(App.web3Provider)

      return App.render()
    })
  },

  render: function () {
    var electionInstance
    var loader = $('#loader')
    var content = $('#content')

    loader.show()
    content.hide()

    // 계정 데이터 로드
    if (web3.currentProvider.enable) {
      //For metamask
      web3.currentProvider.enable().then(function (acc) {
        App.account = acc[0]
        $('#accountAddress').html('Your Account: ' + App.account)
      })
    } else {
      App.account = web3.eth.accounts[0]
      $('#accountAddress').html('Your Account: ' + App.account)
    }

    // 컨트랙트 데이터 로드
    App.contracts.Election.deployed()
      .then(function (instance) {
        electionInstance = instance
        return electionInstance.candidatesCount()
      })
      .then(function (candidatesCount) {
        var candidatesResults = $('#candidatesResults')
        candidatesResults.empty()

        var candidatesSelect = $('#candidatesSelect')
        candidatesSelect.empty()

        for (var i = 1; i <= candidatesCount; i++) {
          electionInstance.candidates(i).then(function (candidate) {
            var id = candidate[0]
            var name = candidate[1]
            var voteCount = candidate[2]

            // 후보 결과 렌더링
            var candidateTemplate =
              '<tr><th>' +
              id +
              '</th><td>' +
              name +
              '</td><td>' +
              voteCount +
              '</td></tr>'
            candidatesResults.append(candidateTemplate)

            // Render candidate ballot option
            var candidateOption =
              "<option value='" + id + "' >" + name + '</ option>'
            candidatesSelect.append(candidateOption)
          })
        }
        return electionInstance.voters(App.account)
      })
      .then(function (hasVoted) {
        // Do not allow a user to vote
        if (hasVoted) {
          $('form').hide()
        }

        loader.hide()
        content.show()
      })
      .catch(function (error) {
        console.warn(error)
      })
  },
  castVote: function () {
    // form이 submit 됐을 때 호출될 부분
    var candidateId = $('#candidatesSelect').val()
    App.contracts.Election.deployed()
      .then(function (instance) {
        return instance.vote(candidateId, { from: App.account })
      })
      .then(function (result) {
        // Wait for votes to update
        $('#content').hide()
        $('#loader').show()
      })
      .catch(function (err) {
        console.error(err)
      })
  },
}

$(function () {
  $(window).load(function () {
    App.init()
  })
})
