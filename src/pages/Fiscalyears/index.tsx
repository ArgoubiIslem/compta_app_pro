import React, { Component, useContext, useEffect, useState, useRef } from 'react';
import { Table, Select, Form, Card, Modal, Drawer, Button, Space, Typography, DatePicker, Checkbox, Input, Alert } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import axios from 'axios'
import JwtContextProvider, { JwtContext } from '../../provider/JwtContextProvider';
import './style.less'
import '../Theme/style-table.less'
import moment from "moment";
import { useParams, useHistory } from 'react-router';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Title } = Typography;

const API_URL = 'http://localhost:8000/api/v1';
const API_URL_ORGANIZATIONS = `${API_URL}/organizations`
const API_URL_TAXSYSTEMS = `${API_URL}/taxsystems`;
const API_URL_FISCALYEARS = `${API_URL}/fiscalyears`;
const API_URL_ARGUMENTS = `${API_URL}/arguments`
const API_URL_ARCHIVE = `${API_URL}/archive`

interface props {
  item: {
    id: number,
    year: string,
    start: string,
    end: string,
    open: string,
    archived: string,
    organization: string,
    isVisible: boolean,
  }
}

interface IState {
  orga: string,
  date: string,
  startDate: string,
  endDate: string,
  open: boolean,
  archived: boolean,
  checked: boolean,
  show1: boolean,
  show2: boolean,
}

const FiscalYears: React.FC<props> = () => {
  const [alert, setAlert] = useState([{}])
  const [state, setState] = useState<IState>({
    show1: false,
    show2: false
  })
  const Edit: React.FC<props> = (props) => {
    const [visible, setVisible] = useState(false)
    const [year, setyear] = useState(props.item.year)
    const [start, set_start] = useState(props.item.start)
    const [end, setend] = useState(props.item.end)

    const [organization, setorganisation] = useState(props.item.organization.id)
    const [state, setState] = useState<IState>({
      date: '',
      startDate: '',
      endDate: '',
      open: props.item.open,
      archived: props.item.archived

    });
    const [form] = Form.useForm();
    const status = useContext(JwtContext);
    const token = status.jwtAccess;

    const config = {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        page_size: 1000,
        organization: status.organization,

      }
    };
    // const yearEdit=moment(year.toString())
    const showDrawer = () => {
      setVisible(true);
    };
    const onClose = () => {
      setVisible(false);
    };

    const handleCancel = () => {
      setVisible(false)
    };


    //--------------change fiscal year & start and end date------------

    state.date = moment(year.toString())

    const onChangeDate = (e: any, dateString: any) => {
      state.date = dateString;
      console.log("********************")
      console.log(dateString)
      state.startDate = moment(state.date)
      state.endDate = moment(state.date)
      const start = state.startDate
      const end = state.endDate

      form.setFieldsValue({ start: start });
      form.setFieldsValue({ end: end });
    };
    //------------------------------------
    const onFinishEdit = (values: { year: any; start: any; end: any; open: any; archived: any; organization: any; }) => {

      if(typeof(state.date) != "string")
      {
        console.log("****************")
        state.date = state.date._i
        console.log("****************")
      }
      const options: any = {
        url: `${API_URL_FISCALYEARS}/${props.item.id}/`,
        method: 'PATCH',
        data: {
          year: state.date,
          start: values.start,
          end: values.end,
          open: values.open,
          archived: values.archived,
          organization: organization,


        },

        headers: { Authorization: `Bearer ${token}` }
      };
      console.log(options.data)
      axios(options)
        .then(response => {
          console.log(response)
          setState({ ...state, show1: true })
          setAlert(['edit', Number(state.date)]);
          setVisible(false)

        })
        .catch(error => {
          console.log(error.response)
          setVisible(true)
        })
    };

    return (
      <div>
        <Button style={{ marginTop: 0, backgroundColor: '#faad14', border: 0 }} type="primary"
          onClick={showDrawer}>
             Editer
        </Button>
       {/* <Archive item={props.item} />
        <Delete item={props.item} />*/}

        <Drawer
          title="Mettre a jours l'année fiscal"
          placement="right"
          closable={false}
          onClose={onClose}
          visible={visible}
          width="100%"
        >

          <Form
            name="control-ref"
            onFinish={onFinishEdit}
            form={form}
          >
            <Form.Item
              initialValue={state.date}
              name="year"
              label="fiscal years ">
              <DatePicker picker="year" style={{ width: "100%" }} onChange={onChangeDate} />
            </Form.Item>

            <Form.Item
              initialValue={moment(start)}
              name="start"
              label="Fiscal year start date">
              <DatePicker format="DD-MM-YYYY" style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              initialValue={moment(end)}
              name="end"
              label="Fiscal year end date ">
              <DatePicker format="DD-MM-YYYY" style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              initialValue={state.open}
              name="open"
              label="Open"
              valuePropName="checked"
              onChange={(v: { target: { checked: boolean } }) => state.open = v.target.checked}
            >

              <Checkbox>Is this fiscal year open ?</Checkbox>

            </Form.Item>

            <Form.Item
              initialValue={state.archived}
              name="archived"
              label="Archived"
              valuePropName="checked"
              onChange={(v: { target: { checked: boolean } }) => {
                state.archived = v.target.checked
              }}
            >
              <Checkbox>Is this fiscal year archived ?</Checkbox>
            </Form.Item>

            <Form.Item
              initialValue={props.item.organization.display_name}
              name="organization"
              label="Organisation">
              <Input />
            </Form.Item>


            <Button key="back" onClick={handleCancel}>
              Retour
            </Button>,
            <Button htmlType="submit" type="primary">
              Valider
            </Button>
          </Form>
        </Drawer>
      </div>
    );

  }

  const Delete: React.FC<props> = (props) => {
    const [visible, setVisible] = useState(false)
    const status = useContext(JwtContext);
    const token = status.jwtAccess;

    const showModal = () => {

      setVisible(true)
    };
    const handleCancel = () => {
      setVisible(false)
    };
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };

    const handleOk: () => void = () => {
      axios.delete(`${API_URL_FISCALYEARS}/${props.item.id}`, config)
        .then(response => {
          console.log(response)
          setVisible(false)
          setAlert(['delete', props.item.year]);


        }).catch(error => {
          console.log(error)
          console.log(config)

        });
    }
    return (
      <div>
        {/*<Button style={{ marginTop: 0, width: 'auto', border: 0 }} type="primary" danger onClick={showModal}>
          Supprimer
    </Button>*/}
        <Modal
          title="Supprime l'annees "
          visible={visible}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={[
            <Button key="back" onClick={handleCancel}>
              Retour
            </Button>,
            <Button key="submit" type="primary" onClick={handleOk}>
              Submit
            </Button>,
          ]}
        >
          Etes-vous sûr que vous voulez supprimer l'année fiscal {props.item.year}
        </Modal>
      </div>
    );

  }
  const Archive: React.FC<props> = (props) => {
    const [visible, setVisible] = useState(false)
    const status = useContext(JwtContext);
    const token = status.jwtAccess;
    const showModal = () => {
      console.log(props.item.id)
      setVisible(true)
    };
    const handleCancel = () => {
      setVisible(false)
    };
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };

    const handleOk = async () => {
      await axios.patch(`${API_URL_ARCHIVE}/${props.item.id}/`, { open: false, archived: true }, config,)
        .then(response => {
          console.log(response)
          setVisible(false)
          setAlert(['archive', props.item.year]);
        })
        .catch(function (error) {
          if (error.response) {
            // The request was made and the server responded with a status code
            setAlert(['other',props.item.year,error.response.data.message]);
            console.log(config)
            console.log(error.response.data.message);
            // console.log(error.response.status);
            // console.log(error.response.headers);
          } else if (error.request) {
            // The request was made but no response was received
            console.log(error.request);
          } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message);
          }
          console.log(error.config);
        })
    }
    return (
      <div>
        <Button style={{ marginTop: 2, width: "100px", border: 0 }} type="primary" onClick={showModal}>
          Archiver
        </Button>
        <Modal
          title="Archiver une année fiscale"
          visible={visible}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={[
            <Button key="back" onClick={handleCancel}>
              Retour
            </Button>,
            <Button key="submit" type="primary" onClick={handleOk}>
              Submit
            </Button>,
          ]}
        >
          Voulez vous vraiment archiver l'année   {props.item.year} ?
        </Modal>
      </div>
    );
  }



  const Add: React.FC = () => {
    const [visible, setVisible] = useState(false)
    const [dates, setDates] = useState<[{}]>([{}]);
    const [argumentId, setArgumentId] = useState<[{}]>([{}]);
    const [organisations, setorganisation] = useState([])
    const status = useContext(JwtContext);
    const userId = status.user_id;
    const fiscal = status.fiscal_year;
    const argument = status.argument
    const token = status.jwtAccess;
    const [form] = Form.useForm();
    const [state, setState] = useState<IState>({
      orga: '',
      date: '',
      startDate: '',
      endDate: '',
      open: false,
      archived: false,
      checked: true,
    });
    const config = {
      headers: { Authorization: `Bearer ${token}` },

      params: {
        page_size: 1000,
        organization: status.organization,
        owner: status.user_id
      }
    };
    const showDrawer = () => {
      setVisible(true);
    };

    const onClose = () => {
      setVisible(false);
    };


    const handleCancel = () => {
      setVisible(false)
    };

    const onchangeorga = (e: string) => {
      state.orga = e
    }



    const SetArgument = (orgaIds: any) => {


      console.log(orgaIds, organisations)

      const options: any = {
        url: `${API_URL_ARGUMENTS}/${argument}/`,
        method: 'PATCH',
        data: {

          organizations: orgaIds,


        },
        headers: { Authorization: `Bearer ${token}` }
      };
      axios(options)
        .then(response => {
          console.log(response)
          window.location.reload();
        })
        .catch(error => {
          console.log(error.response)
          setVisible(true)
        })
    };




    useEffect(() => {
      axios.get(`${API_URL_ORGANIZATIONS}/`, config)
        .then(response => {
          setorganisation(response.data.results);

        }).catch(error => {
        });
    }, [])

    let optionItems = organisations.map((organisation: any) =>
      <Option value={organisation.id} key={organisation.id}> {organisation.display_name}</Option>
    );



    //-----------get value year--------------------
    var tabledates = dates.filter(el => el.id == fiscal);

    const yearDate = tabledates.map(el => el.year);
    state.date = yearDate.toString();
    console.log(state.date)

    const total = moment(state.date);
    state.startDate = total
    state.endDate = total

    const start = state.startDate
    const end = state.endDate

    form.setFieldsValue({ start: start });
    form.setFieldsValue({ end: end });

    const onChangeDate = (e, dateString) => {
      state.date = dateString;

      state.startDate = moment(state.date)
      state.endDate = moment(state.date)

      const start = state.startDate
      const end = state.endDate

      form.setFieldsValue({ start: start });
      form.setFieldsValue({ end: end });

    };
    //-------------------------value open and archived ---------------------
    const onChangeOpen = (e: { target: { checked: boolean } }) => {

      state.open = e.target.checked


    }
    const onChangeArchived = (e: { target: { checked: boolean } }) => {
      state.archived = e.target.checked

    }

    useEffect(() => {


      axios.get(`${API_URL_FISCALYEARS}/`, config)
        .then(response => {
          setDates(response.data.results);
        }).catch(error => {
        });
      }, [])
    //---------------------------------------------

    const onFinish = (values: {
      year: string; start: string; end: string; open: string; archived: string
    }) => {
      axios.post(`${API_URL_FISCALYEARS}/`,
        {
          year: Number(state.date),
          start: values.start,
          end: values.end,
          open: state.open,
          archived: state.archived,
          organization: state.orga,

        }, config)
        .then(response => {
          console.log(response)
          setVisible(false)
          setState({ ...state, show1: true })
          setAlert(['post', moment(values.year).year()]);
          const orgaIds = organisations.map(el => el.id)

          console.log(organisations, orgaIds, userId)

          SetArgument(orgaIds)

        }).catch(error => {
          console.log(error.response)
          console.log(values.year)
        });

    }
    return (
      <div>
        <Button style={{ float: 'right' }} type="primary" onClick={showDrawer}>
          Ajouter
        </Button>
        <Drawer
          title="Ajouter une Fiscal years"
          placement="right"
          closable={false}
          onClose={onClose}
          visible={visible}
          width="100%"
        >
          <Form
            onFinish={onFinish}
            form={form}
          >
            <Form.Item
              name="year"
              label="year fiscal"
              initialValue={total}
            >
              <DatePicker onChange={onChangeDate} value={state.date} picker="year" style={{ width: "100%" }} />

            </Form.Item>
            <Form.Item
              name="start"
              label="Fiscal year start date"
            >
              <DatePicker format="DD-MM-YYYY" style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              name="end"
              label="Fiscal year end date">
              <DatePicker format="DD-MM-YYYY" style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              name="open"
              label="Open"
              valuePropName="checked"

            >
              <Checkbox checked={state.open} onChange={onChangeOpen}>Is this fiscal year open ?</Checkbox>
            </Form.Item>

            <Form.Item
              name="archived"
              label="Archived"
              valuePropName="checked"
            >
              <Checkbox checked={state.archived} onChange={onChangeArchived}>Is this fiscal year archived ?</Checkbox>
            </Form.Item>

            <Form.Item
              name="organisation"
              label="organisation"
            >
              <Select onChange={onchangeorga}>
                {optionItems}
              </Select>
            </Form.Item>


            <Button key="back" onClick={handleCancel}>
              Retour
            </Button>,
            <Button htmlType="submit" type="primary">
              Valider
            </Button>
          </Form>
        </Drawer>
      </div>
    );

  }

  const Get: React.FC = () => {

    const [data, setData] = useState([])
    const [state, setState] = useState({
      select: '',
      searchedColumn: '',
    })
    const [isLoading, setIsLoading] = useState(true);
    const status = useContext(JwtContext);
    const token = status.jwtAccess;
    const fiscal = status.fiscal_year
    const config = {
      headers: { Authorization: `Bearer ${token}` },

      params: {
        page_size: 1000,
        organization: status.organization,

      }
    };
    //--------------------
    const getColumnSearchProps = dataIndex => ({
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder={`Search ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
            style={{ marginBottom: 8, display: 'block' }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              Search
            </Button>
            <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
              Reset
            </Button>

          </Space>
        </div>
      ),
      onFilter: (value, record) => record.year == value,

    })
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
      confirm();
      setState({
        select: selectedKeys[0],
        searchedColumn: dataIndex,
      });
    };

    const handleReset = clearFilters => {
      clearFilters();
      setState({ searchText: '' });
    };
    //---------------------
    const columns = [

      {

        title: 'Année Fiscal',
        dataIndex: 'year',
        ...getColumnSearchProps('year')

      },
      {
        title: 'Date début',
        dataIndex: 'start',
        render: text => <span data-title="Fiscal year start date">{moment(text).format("DD-MM-YYYY")}</span>
      },
      {
        title: 'Date Fin',
        dataIndex: 'end',
        render: text => <span data-title="Fiscal year end date">{moment(text).format("DD-MM-YYYY")}</span>
      },
      {
        title: 'Ouvert',
        dataIndex: 'open',
        render: (open: boolean) => {
          if (open == true) {
            return (
              <span style={{color: 'green'}}data-title="Open" key={open}>
                Oui
              </span>
            );
          }

          return (
            <span  style={{color: 'red'}} data-title="Open" key={open}>
              Non
            </span>
          );
        }
      },
      {
        title: 'Archivé',
        dataIndex: 'archived',
        render: (archived: boolean) => {
          if (archived == true) {
            return (
              <span style={{color: 'green'}} data-title="Archived" key={archived}>
                Oui
              </span>
            );
          }

          return (
            <span style={{color: 'red'}} data-title="Archived" key={archived}>
              Non
            </span>
          );
        }

      },
      {
        title: 'Organisation',
        dataIndex: 'organization',
        render: (text, record) => (<span data-title="Organization">{record.organization.display_name}</span>)
      },

      {
        title: 'Actions',
        dataIndex: 'action',
        render: (text, record) => (
          <span data-title="Actions">
            <Space className="positionButton">
              {/*<Delete item={record}/>*/}
              <Archive item={record}/>
              <Edit item={record} />
            </Space>
          </span>
        ),
      },
    ];
    ;
    useEffect(() => {
      axios.get(`${API_URL_FISCALYEARS}/`, config)
        .then(response => {

          setData(response.data.results);
          setIsLoading(false)


        }).catch(error => {
        })
      }, []);
    return (
      <Table style={{marginTop: 75}} rowKey="id" bordered columns={columns} dataSource={data}
      loading={isLoading}
      />
    )
  }


  return (
    <JwtContextProvider>
      <Card>
        {(alert[0] === 'post' && !state.show1) ?
          <Alert message={`l'année fiscal ${alert[1]} a été créé avec succès`} type="success" onClose={setTimeout(() => {
            setState({ ...state, show1: true })
          }, 5000)} /> : ''}
        {(alert[0] === 'edit' && !state.show2) ?
          <Alert message={`l'année fiscal ${alert[1]}  a été mis à jour avec succès`} type="warning"
            onClose={setTimeout(() => {
              setState({ ...state, show2: true })
            }, 5000)} /> : ''}
        <Title level={2}>List des exercices comptables  </Title>
        {(alert[0] === 'archive') ? <Alert message={`${alert[1]}  a été archivé avec succès`} type="success" closable /> : ''}
        {(alert[0] === 'other') ? <Alert message={`${alert[1]}: ${alert[2]} `} type="error" closable /> : ''}

        <Add />
        <Get />
      </Card>
    </JwtContextProvider>
  )

}
export default FiscalYears;
