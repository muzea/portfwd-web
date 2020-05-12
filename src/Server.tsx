import React, {
  useContext,
  useMemo,
  useCallback,
  useState,
  useEffect,
} from "react";
import { Form, Input, Button, Badge, notification, Switch } from "antd";
import { StateContext, Action } from "./reducer";
import { Api } from "./api";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 8 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

export default function Server() {
  const { state, dispatch } = useContext(StateContext);
  const [checking, setChecking] = useState(false);

  const handleCheck = useCallback(async () => {
    setChecking(true);
    Api.setServer(state.host, state.port);
    try {
      await Api.ping();
      dispatch({
        type: Action.ServerConnected,
        value: true,
      });
    } catch (error) {
      notification.error({
        message: "请求报错",
        description: error.toString(),
      });
    }
    setChecking(false);
  }, []);

  useEffect(() => {
    if (state.autoConnect) {
      handleCheck();
    }
  }, []);

  const defaultValue = useMemo(() => {
    return {
      host: state.host,
      port: state.port,
      autoConnect: state.autoConnect,
    };
  }, []);

  const updateValus = useCallback((changedValues) => {
    for (const key of Object.keys(changedValues)) {
      dispatch({
        type: Action.FormChange,
        key,
        value: changedValues[key],
      });
    }
  }, []);

  return (
    <Form {...layout} initialValues={defaultValue} onValuesChange={updateValus}>
      <Form.Item label="服务器状态">
        {state.ServerConnected ? (
          <Badge status="success" text="当前已链接" />
        ) : (
          <Badge status="error" text="未链接到服务器" />
        )}
      </Form.Item>
      <Form.Item label="服务器地址" name="host">
        <Input />
      </Form.Item>
      <Form.Item label="端口" name="port">
        <Input type="number" />
      </Form.Item>
      <Form.Item
        label="记住服务器配置，下次自动链接"
        valuePropName="checked"
        name="autoConnect"
      >
        <Switch />
      </Form.Item>
      <Form.Item {...tailLayout}>
        <Button type="primary" onClick={handleCheck} loading={checking}>
          连接到服务器
        </Button>
      </Form.Item>
    </Form>
  );
}
