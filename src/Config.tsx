import React, {
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import { Table, Modal, Form, Input, Button, notification } from "antd";
import { StateContext, Action } from "./reducer";
import { Api } from "./api";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 8 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

function isInput(type) {
  return ["localPort", "remotePort"].includes(type);
}

function getValueFromEvent(type, event) {
  if (isInput(type)) {
    return event.target.value;
  }
}

enum ModalType {
  Add = "add",
  Edit = "edit",
}

const DefaultModalState = {
  localPort: 53,
  remoteHost: "8.8.8.8",
  remotePort: 53,
  rangeLength: 1,
};

export default function Config() {
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalState, setModalState] = useState({
    ...DefaultModalState,
    type: "",
  });
  const { state, dispatch } = useContext(StateContext);
  const updateList = useCallback(async () => {
    const resp = await Api.list();
    dispatch({
      type: Action.UpdateList,
      value: resp,
    });
  }, []);
  useEffect(() => {
    updateList().then(() => setLoading(false));
  }, []);

  const handleAdd = useCallback(() => {
    setModalState({
      ...DefaultModalState,
      type: ModalType.Add,
    });
    setModalVisible(true);
  }, []);

  const handleEdit = useCallback((item) => {
    const [remoteHost, remotePort] = item.remote.split(":");
    setModalState({
      localPort: item.local,
      remoteHost,
      remotePort,
      rangeLength: 1,
      type: ModalType.Edit,
    });
    setModalVisible(true);
  }, []);

  const handleDelete = useCallback(
    (item) => {
      Modal.confirm({
        centered: true,
        content: "确认删除吗？",
        async onOk() {
          setLoading(true);
          try {
            await Api.delete(item.localPort);
          } catch (error) {
            notification.error({
              message: "请求报错",
              description: error.toString(),
            });
          }
          await updateList();
          setLoading(false);
        },
      });
    },
    [modalState]
  );

  const handleModalCancel = useCallback(() => {
    setModalVisible(false);
  }, []);

  const handleModalSubmit = useCallback(async () => {
    setModalVisible(false);
    setLoading(true);
    try {
      switch (modalState.type) {
        case ModalType.Add: {
          await Api.add({
            local: `${modalState.localPort}`,
            target: `${modalState.remoteHost}:${modalState.remotePort}`,
          });
          break;
        }
        case ModalType.Edit: {
          await Api.update({
            localPort: `${modalState.localPort}`,
            target: `${modalState.remoteHost}:${modalState.remotePort}`,
          });
          break;
        }
      }
      await updateList();
    } catch (error) {
      notification.error({
        message: "请求报错",
        description: error.toString(),
      });
    }
    setLoading(false);
  }, [modalState]);

  const list = useMemo(() => {
    const mapList = state.mapList;
    return Object.keys(mapList).map((local) => {
      return {
        local,
        remote: mapList[local],
      };
    });
  }, [state]);

  const columns = useMemo(() => {
    return [
      {
        title: "服务器端口",
        dataIndex: "local",
        key: "local",
      },
      {
        title: "映射到",
        dataIndex: "remote",
        key: "remote",
      },
      {
        title: "操作",
        key: "action",
        render: (text, record) => (
          <span className="actions">
            <a onClick={() => handleEdit(record)}>编辑</a>
            <a onClick={() => handleDelete(record)}>删除</a>
          </span>
        ),
      },
    ];
  }, []);

  // 淦 https://github.com/ant-design/ant-design/issues/23898
  const createBind = useCallback(
    (key) => {
      return {
        value: modalState[key],
        onChange(event) {
          setModalState({
            ...modalState,
            [key]: getValueFromEvent(key, event),
          });
        },
      };
    },
    [modalState]
  );
  const bindLocalPort = useMemo(() => createBind("localPort"), [modalState]);
  const bindRemoteHost = useMemo(() => createBind("remoteHost"), [modalState]);
  const bindRemotePort = useMemo(() => createBind("remotePort"), [modalState]);

  // 淦 https://github.com/ant-design/ant-design/issues/23948
  const table = useMemo(() => {
    return (
      <Table
        rowKey="local"
        loading={loading}
        columns={columns}
        dataSource={list}
        pagination={false}
      />
    );
  }, [list, columns, loading]);
  return (
    <div>
      <Button
        className="add-button"
        type="primary"
        onClick={handleAdd}
        loading={loading}
      >
        添加新的映射
      </Button>
      {table}
      <Modal visible={modalVisible} footer={null} onCancel={handleModalCancel}>
        <div>
          <Form.Item {...layout} label="服务器端口">
            <Input
              disabled={modalState.type === ModalType.Edit}
              {...bindLocalPort}
              type="number"
            />
          </Form.Item>
          <Form.Item {...layout} label="目标服务器">
            <Input {...bindRemoteHost} />
          </Form.Item>
          <Form.Item {...layout} label="目标端口">
            <Input {...bindRemotePort} type="number" />
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Button type="primary" onClick={handleModalSubmit}>
              保存
            </Button>
            <Button onClick={handleModalCancel}>取消</Button>
          </Form.Item>
        </div>
      </Modal>
    </div>
  );
}
