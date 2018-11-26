/*drop database simplebike;*/
CREATE DATABASE `simplebike` /*!40100 DEFAULT CHARACTER SET latin1 */;
Use simplebike;

CREATE TABLE `driver` (
  `idDriver` int(11) NOT NULL AUTO_INCREMENT,
  `driverName` varchar(45) NOT NULL,
  `driverUserName` varchar(45)NOT null,
  `driverPasswords` varchar(45)NOT null,
  `driverPhone` varchar(45) NOT NULL,
  `lastLocation` varchar(45) default NULL,
  `driverState` int(11) NOT NULL,/* 0: Busy 1: Ready*/
  PRIMARY KEY (`idDriver`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `staff` (
  `idStaff` int(11) NOT NULL AUTO_INCREMENT,
  `staffName` varchar(45) DEFAULT NULL,
  `staffPhone` varchar(45) DEFAULT NULL,
  `staffUsername` varchar(45) NOT NULL,
  `staffPassword` varchar(45) NOT NULL,
  `staffRole` int NOT NULL, /*1: phoner 2: locater 3: manager 4: driver*/
  PRIMARY KEY (`idStaff`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


CREATE TABLE `request` (
  `idRequest` int(11) NOT NULL AUTO_INCREMENT,
  `clientName` varchar(45) NOT NULL,
  `clientPhone` varchar(45) NOT NULL,
  `clientAddress` varchar(255) NOT NULL,
  `clientAddressNoSign` varchar(255) NOT NULL,
  `requestState` int(11) NOT NULL,/*0: NoLocate 1: Located 2: Assigned 3: Moving 4: Finish 5: NoBike*/
  `countSearch` int(11) NOT NULL,
  `idDriver` int(11) DEFAULT NULL,
  `startX` float DEFAULT NULL,
  `startY` float DEFAULT NULL,
  `idStaff` int(11) NOT NULL,
  `requestTime` datetime NOT NULL,
  `clientNote` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`idRequest`),
  FOREIGN KEY ( `idDriver`) REFERENCES driver( `idDriver`),
  FOREIGN KEY ( `idStaff`) REFERENCES staff( `idStaff`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


CREATE TABLE `token` (
  `idStaff` int(11) NOT NULL,
  `staffRole` varchar(45) NOT NULL,
  `token` varchar(255) NOT NULL,
  `time` datetime NOT NULL,
  PRIMARY KEY (`idStaff`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


insert into staff(staffName,staffPhone,staffUsername,staffPassword,staffRole) values
('LongCH','456456456','LongCH','456789',1),
('VinhHNQ','321321321','VinhHNQ','456456',2),
('NhatNQ','321321322','NhatNQ','123123',3);

insert into driver(driverName,driverPhone,lastLocation,driverState,driverUsername,driverPasswords) values
('LongCH','456456456','10.76299,106.68252',0,'LongCH','123456'),
('VinhHNQ','321321321','11.76299,106.68252',0,'VinhHNQ','123456'),
('NhatNQ','321321322','12.76299,106.68252',1,'NhatNQ','123456');

insert into request(clientName,clientPhone,clientAddress,requestState,countSearch,idDriver,startX,startY,idStaff,requestTime,clientAddressNoSign) values
('LongCH', '456456456',N'227 Nguyen Van Cu',0,0,NULL,10.76299,106.68252,1,'2018-11-18 13:17:17',N'227 Nguyen Van Cu'),
('VinhHNQ','321321321',N'227 Nguyen Van Cu',2,1,1,10.76299,106.68252,1,'2018-11-18 13:17:17',N'227 Nguyen Van Cu'),
('NhatNQ','321321322',N'227 Nguyen Van Cu',2,1,2,10.76299,106.68252,1,'2018-11-18 13:17:17',N'227 Nguyen Van Cu'),
('NhatNQ','321321322',N'323/4 Le Quang Dinh',2,1,2,10.811472,106.6881282,1,'2018-11-18 13:17:17',N'323/4 Le Quang Dinh'),
('LongHC', '456453356',N'227 Nguyen Van Cu',2,0,3,10.76299,106.68252,1,'2018-11-18 13:17:17',N'227 Nguyen Van Cu'),
('VinhHQ','321321221',N'227 Nguyen Van Cu',2,0,1,10.76299,106.68252,1,'2018-11-18 13:17:17',N'227 Nguyen Van Cu'),
('NhatNHQ','321324422',N'227 Nguyen Van Cu',2,0,2,10.76299,106.68252,1,'2018-11-18 13:17:17',N'227 Nguyen Van Cu'),
('NhatN','321344322',N'323/4 Le Quang Dinh',2,0,3,10.811472,106.6881282,1,'2018-11-18 13:17:17',N'323/4 Le Quang Dinh');



